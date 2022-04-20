package main

import (
	"encoding/json"
	"fmt"
	"github.com/umahmood/haversine"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"gorm.io/driver/sqlite"
	//	"github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type App struct {
	db *gorm.DB
	r  *mux.Router
}

func (a *App) start() {
	err := a.db.AutoMigrate(&User{})
	if err != nil {
		panic("Failed to migrate database")
	}

	go manager.start1()

	// DB functions
	a.r.HandleFunc("/getAllUserInfo", a.getAllUserInfo).Methods("GET")
	a.r.HandleFunc("/getLoginInfo", a.getLoginInfo).Methods("GET")
	a.r.HandleFunc("/getLoggedInUser", a.getLoggedInUser).Methods("GET")
	a.r.HandleFunc("/login", a.login).Methods("POST")
	a.r.HandleFunc("/sign_Up", a.sign_Up).Methods("POST")
	a.r.HandleFunc("/upload", a.upload).Methods("POST")
	a.r.HandleFunc("/getFilterDistance", a.getFilterDistance).Methods("GET")
	a.r.HandleFunc("/ws", wsPage)

	handle := a.getHandle()
	log.Fatal(http.ListenAndServe(":8080", handle))
}

func (a *App) getAllUserInfo(w http.ResponseWriter, r *http.Request) {
	var users []User
	// Grab users from the database
	err := a.db.Find(&users).Error
	if err != nil {
		panic(err)
	}
	// Encode data into json and respond the request
	err = json.NewEncoder(w).Encode(users)
	if err != nil {
		http.Error(w, err.Error(), 400)
	}
}

func (a *App) getLoginInfo(w http.ResponseWriter, r *http.Request) {

	var login Login

	keys, ok := r.URL.Query()["key"]

	if !ok || len(keys[0]) < 1 {
		log.Println("Url Param 'key' is missing")
		return
	}

	id, err1 := strconv.Atoi(keys[0])
	log.Println(err1, id)

	err := a.db.First(&login, "Id = ?", 0002).Error
	fmt.Println("First user age:", login)
	if err != nil {
		panic(err)
	}
	err = json.NewEncoder(w).Encode(login)
	if err != nil {
		http.Error(w, err.Error(), 400)
	}

}

func (a *App) login(w http.ResponseWriter, r *http.Request) {
	// Decode login info
	var login Login
	err := json.NewDecoder(r.Body).Decode(&login)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	// Find if user is in database
	var user Login
	err = a.db.First(&user, "email = ?", login.Email).Error
	if err != nil {
		http.Error(w, "Invalid email", 400)
		return
	}
	// Find if login password matches user's password
	isMatch := doPasswordMatch(user.Password, login.Password)
	if !isMatch {
		http.Error(w, "Invalid login", 400)
		return
	}
	// Create JWT token and set cookie
	expirationTime := time.Now().Add(5 * time.Minute)
	tokenString, err := createToken(user.Email, expirationTime)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})
}

func (a *App) sign_Up(w http.ResponseWriter, r *http.Request) {
	// Decode sign_Up info
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	// Find if user is in database
	err = a.db.First(&user.Login_var, "email = ?", user.Login_var.Email).Error
	if err != gorm.ErrRecordNotFound {
		http.Error(w, "Invalid email", 400)
		return
	}
	// Hash the password before storing in db
	user.Login_var.Password, err = hashPassword(user.Login_var.Password)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	err = a.db.Create(&user).Error
	if err != nil {
		http.Error(w, "Invalid entry", 400)
		return
	}

	// Create JWT token and set cookie
	expirationTime := time.Now().Add(5 * time.Minute)
	tokenString, err := createToken(user.Login_var.Email, expirationTime)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})
}

func (a *App) getLoggedInUser(w http.ResponseWriter, r *http.Request) {
	token, err := VerifyToken(w, r)
	if err != nil {
		return
	}
	var user User
	var login Login
	// Find matching login to token
	err = a.db.First(&login, "email = ?", token.claims.Username).Error
	if err != nil {
		http.Error(w, "Invalid login token", 400)
	}
	// Find user associated with login
	err = a.db.First(&user, "id = ?", login.UserID).Error
	if err != nil {
		panic(err)
	}
	user.Login_var.Email = login.Email
	// Encode data into json and respond the request
	err = json.NewEncoder(w).Encode(user)
	if err != nil {
		http.Error(w, err.Error(), 400)
	}
}

func (a *App) getCurrentUserId(w http.ResponseWriter, r *http.Request) int {
	token, err := VerifyToken(w, r)
	if err != nil {
		return 0
	}
	var user User
	var login Login
	// Find matching login to token
	err = a.db.First(&login, "email = ?", token.claims.Username).Error
	if err != nil {
		http.Error(w, "Invalid login token", 400)
	}
	// Find user associated with login
	err = a.db.First(&user, "id = ?", login.UserID).Error
	if err != nil {
		panic(err)
	}
	return login.UserID
}

func (a *App) getFilterDistance(w http.ResponseWriter, r *http.Request) {
	latitude, err := strconv.ParseFloat(r.URL.Query().Get("latitude"), 64)
	if err != nil {
		http.Error(w, "could not parse latitude", 400)
	}
	longitude, err := strconv.ParseFloat(r.URL.Query().Get("longitude"), 64)
	if err != nil {
		http.Error(w, "could not parse longitude", 400)
	}
	distance, err := strconv.ParseFloat(r.URL.Query().Get("distance"), 64)
	if err != nil {
		http.Error(w, "could not parse distance", 400)
	}
	searchLocation := haversine.Coord{Lat: latitude, Lon: longitude}
	var places []Place
	// Grab all places from the database
	err = a.db.Find(&places).Error
	if err != nil {
		panic(err)
	}
	var closePlaces []Place
	for _, place := range places {
		location := haversine.Coord{Lat: float64(place.Latitude), Lon: float64(place.Longitude)}
		milesDifference, _ := haversine.Distance(searchLocation, location)
		if milesDifference <= distance {
			closePlaces = append(closePlaces, place)
		}
	}
	var ids []int
	for _, closePlace := range closePlaces {
		ids = append(ids, closePlace.UserID)
	}
	if len(ids) == 0 {
		return
	}
	var closeUsers []User
	err = a.db.Find(&closeUsers, ids).Error
	if err != nil {
		panic(err)
	}
	err = json.NewEncoder(w).Encode(closeUsers)
	if err != nil {
		http.Error(w, err.Error(), 400)
	}
}

func (a *App) upload(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Upload Method Works")
}

/****************************************CHAT FUNCTIONALITY**********************************************/

// The ClientManager will keep track of all the connected clients,
// clients that are trying to become registered,
// clients that have become destroyed and are waiting to be removed,
// and messages that are to be broadcasted to and from all connected clients.
type ClientManager struct {
	clients    map[*Client]bool // all connected clients
	broadcast  chan []byte      // messages that are to be broadcasted from and to all connected clients
	register   chan *Client     // clients trying to be registered
	unregister chan *Client     // clients trying to be unregistered/removed
}

// Each Client has a unique id, a socket connection, and a message waiting to be sent
type Client struct {
	id     string          // client ID
	socket *websocket.Conn // the connection socket
	send   chan []byte     // message to send
}

// To add complexity to the data being passed around, it will be in JSON format.
// Instead of passing around a string of data which cannot easily be tracked we are passing around JSON data.
// With JSON we can have meta and other useful things.
// Each of our messages will contain information regarding who sent the message, who is receiving the message and the actual content of the message.
type Message struct {
	Sender    string `json:"sender,omitempty"`
	Recipient string `json:"recipient,omitempty"`
	Content   string `json:"content,omitempty"`
}

// Spinning up a global ClientManager for our application to use
var manager = ClientManager{
	broadcast:  make(chan []byte),
	register:   make(chan *Client),
	unregister: make(chan *Client),
	clients:    make(map[*Client]bool),
}

// The server will use three goroutines:
// 1. For managing the clients
// 2. For reading websocket data, and
// 3. For writing websocket data.
// The catch here is that the read and write goroutines will get a new instance for every client that connects.
// All goroutines will run on a loop until they are no longer needed.
// Starting with the server goroutine we have the following:

func (manager *ClientManager) start1() {
	for {
		select {
		case conn := <-manager.register:
			manager.clients[conn] = true
			jsonMessage, _ := json.Marshal(&Message{Content: "/A new socket has connected."})
			manager.send(jsonMessage, conn)
		case conn := <-manager.unregister:
			if _, ok := manager.clients[conn]; ok {
				close(conn.send)
				delete(manager.clients, conn)
				jsonMessage, _ := json.Marshal(&Message{Content: "/A socket has disconnected."})
				manager.send(jsonMessage, conn)
			}
		case message := <-manager.broadcast:
			// Looks like this is the place where messages are being sent from
			for conn := range manager.clients {
				select {
				case conn.send <- message:
				default:
					close(conn.send)
					delete(manager.clients, conn)
				}
			}
		}
	}
}

// Every time the manager.register channel has data,
// The client will be added to the map of available clients managed by the client manager.
// After adding the client, a JSON message is sent to all other clients, not including the one that just connected.

// If a client disconnects for any reason,
// the manager.unregister channel will have data.
// The channel data in the disconnected client will be closed and
// the client will be removed from the client manager. A message announcing the disappearance of a socket will be sent to all remaining connections.

// If the manager.broadcast channel has data it means that we’re trying to send and receive messages.
// We want to loop through each managed client sending the message to each of them.
// If for some reason the channel is clogged or the message can’t be sent, we assume the client has disconnected and we remove them instead.
// To save repetitive code, a manager.send method was created to loop through each of the clients:
func (manager *ClientManager) send(message []byte, ignore *Client) {
	for conn := range manager.clients {
		if conn != ignore {
			conn.send <- message
		}
	}
}

// We will send data later with conn.send

// Now we can explore the goroutine for reading websocket data sent from the clients.
// The point of this goroutine is to read the socket data and add it to the manager.broadcast for further orchestration.
func (c *Client) read() {
	defer func() {
		manager.unregister <- c
		c.socket.Close()
	}()

	for {
		_, message, err := c.socket.ReadMessage()
		if err != nil {
			manager.unregister <- c
			c.socket.Close()
			break
		}

		// Added code to strip user_id out of the sent message
		var stringMessage = string(message)
		stringMessage = strings.TrimSpace(stringMessage)
		var index = strings.LastIndex(stringMessage, " ")
		var userId = stringMessage[index:]
		stringMessage = stringMessage[0:index]
		// End of Added code to strip user_id out of the sent message

		//jsonMessage, _ := json.Marshal(&Message{Sender: c.id, Content: string(message), Recipient: userId})
		jsonMessage, _ := json.Marshal(&Message{Sender: c.id, Recipient: strings.TrimSpace(userId), Content: stringMessage})
		manager.broadcast <- jsonMessage
	}
}

// If there was an error reading the websocket data it probably means the client has disconnected.
// If that is the case we need to unregister the client from our server.

// This is handled in the third goroutine for writing data:
func (c *Client) write() {
	defer func() {
		c.socket.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			var myMessage Message
			json.Unmarshal([]byte(message), &myMessage)

			// Code to only send the Message to Sender and Receiver
			if c.id == myMessage.Sender || c.id == myMessage.Recipient {
				c.socket.WriteMessage(websocket.TextMessage, message)
			}
		}
	}
}

// If the c.send channel has data we try to send the message.
// If for some reason the channel is not alright, we will send a disconnect message to the client.

// To start with each of these goroutines. The server goroutine will be started when we start our server and each of the other goroutines will start when someone connects.
// code is added to the start function in app.go

// We start the server on port 8080 and it has a single endpoint which is only accessible via a websocket connection.
// This endpoint method called wsPage looks like the following:
func wsPage(res http.ResponseWriter, req *http.Request) {
	conn, error := (&websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}).Upgrade(res, req, nil)
	if error != nil {
		http.NotFound(res, req)
		return
	}
	// This is where we are creating client_id for a client
	// AIM: to send user-id from the front-end and use the same thing as a client-id
	r := mux.NewRouter()
	db, err := gorm.Open(sqlite.Open("test1.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	setup(db)
	app := App{db: db, r: r}

	var user_id = strconv.Itoa(app.getCurrentUserId(res, req))

	//client := &Client{id: uuid.NewV4().String(), socket: conn, send: make(chan []byte)}
	client := &Client{id: user_id, socket: conn, send: make(chan []byte)}
	manager.register <- client

	go client.read()
	go client.write()
}

// The HTTP request is upgraded to a websocket request using the websocket library.
// By adding a CheckOrigin we can accept requests from outside domains eliminating cross origin resource sharing (CORS) errors.
// When a connection is made, a client is created and a unique id is generated.
//This client is registered to the server as seen previously. After client registration, the read and write goroutines are triggered.

/****************************************END OF CHAT FUNCTIONALITY**********************************************/
