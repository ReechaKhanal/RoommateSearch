package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

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
	a.r.HandleFunc("/getAllUserInfo", a.getAllUserInfo).Methods("GET")
	a.r.HandleFunc("/getLoginInfo", a.getLoginInfo).Methods("GET")
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
