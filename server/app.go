package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
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
	// DB functions
	a.r.HandleFunc("/getAllUserInfo", a.GetAllUserInfo).Methods("GET")
	a.r.HandleFunc("/getLoginInfo", a.getLoginInfo).Methods("GET")
	a.r.HandleFunc("/login", a.login).Methods("POST")
	handle := a.getHandle()
	log.Fatal(http.ListenAndServe(":8080", handle))
}

func (a *App) GetAllUserInfo(w http.ResponseWriter, r *http.Request) {
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
	tokenString, err := createToken(user.Username, expirationTime)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Expires:  expirationTime,
		HttpOnly: true,
		Secure:   true,
	})
}
