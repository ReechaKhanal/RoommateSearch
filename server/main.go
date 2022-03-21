package main

import (
	"fmt"
	"log"
	"os"
  "net/http"
  "encoding/json"

	"github.com/gorilla/mux"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
  "github.com/gorilla/websocket"
  "github.com/satori/go.uuid"
)

func main() {
	// To Log Error
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: false,
			Colorful:                  true,
		},
	)

	db, err := gorm.Open(sqlite.Open("test1.db"), &gorm.Config{Logger: newLogger})
	if err != nil {
		panic("Failed to connect to database")
	}

	setup(db)
	//Get user info on the terminal
	var users []User
	db.Find(&users)
	for _, u := range users {
		fmt.Println("Name:", u.Name, "Gender:", u.Gender, "Age:", u.Age)
	}

	//Get user info by Id
	var testuser1 User
	db.First(&testuser1, "Id = ?", 0001)
	fmt.Println("First user age:", testuser1.Age)

	// Router to handle server requests, currently unused
	r := mux.NewRouter()
	app := App{db: db, r: r}
	app.start()

  fmt.Println("Starting application...")
  go manager.start()
  http.HandleFunc("/ws", wsPage)
  http.ListenAndServe(":12345", nil)
}

/****************************************CHAT FUNCTIONALITY**********************************************/

// The ClientManager will keep track of all the connected clients,
// clients that are trying to become registered,
// clients that have become destroyed and are waiting to be removed,
// and messages that are to be broadcasted to and from all connected clients.
type ClientManager struct {
  clients    map[*Client]bool
  broadcast  chan []byte
  register   chan *Client
  unregister chan *Client
}

// Each Client has a unique id, a socket connection, and a message waiting to be sent
type Client struct {
  id     string
  socket *websocket.Conn
  send   chan []byte
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

func (manager *ClientManager) start() {
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
      jsonMessage, _ := json.Marshal(&Message{Sender: c.id, Content: string(message)})
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

          c.socket.WriteMessage(websocket.TextMessage, message)
      }
  }
}

// If the c.send channel has data we try to send the message.
// If for some reason the channel is not alright, we will send a disconnect message to the client.

// To start with each of these goroutines. The server goroutine will be started when we start our server and each of the other goroutines will start when someone connects.
// For example, check out the main function:
// func main() {
//   fmt.Println("Starting application...")
//   go manager.start()
//   http.HandleFunc("/ws", wsPage)
//   http.ListenAndServe(":12345", nil)
// }
// Above code is added to the main function

// We start the server on port 12345 and it has a single endpoint which is only accessible via a websocket connection.
// This endpoint method called wsPage looks like the following:
func wsPage(res http.ResponseWriter, req *http.Request) {
  conn, error := (&websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}).Upgrade(res, req, nil)
  if error != nil {
      http.NotFound(res, req)
      return
  }
  client := &Client{id: uuid.NewV4().String(), socket: conn, send: make(chan []byte)}

  manager.register <- client

  go client.read()
  go client.write()
}

// The HTTP request is upgraded to a websocket request using the websocket library.
// By adding a CheckOrigin we can accept requests from outside domains eliminating cross origin resource sharing (CORS) errors.
// When a connection is made, a client is created and a unique id is generated.
//This client is registered to the server as seen previously. After client registration, the read and write goroutines are triggered.

