package main

import (
  "encoding/json"
  "github.com/gorilla/mux"
  "gorm.io/gorm"
  "log"
  "net/http"
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
