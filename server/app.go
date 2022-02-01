package main

import (
  "embed"
  "encoding/json"
  "github.com/gorilla/mux"
  "gorm.io/gorm"
  "io/fs"
  "log"
  "net/http"
)

//go:embed static
var static embed.FS

// This user struct will be stored in the database
type user struct {
  gorm.Model
  Name string
}

type App struct {
  db *gorm.DB
  r  *mux.Router
}

func (a *App) start() {
  err := a.db.AutoMigrate(&user{})
  if err != nil {
    panic("Failed to migrate database")
  }
  webapp, err := fs.Sub(static, "static")
  if err != nil {
    panic(err)
  }
  a.r.HandleFunc("/getAllUserInfo", a.getAllUserInfo).Methods("GET")
  a.r.PathPrefix("/").Handler(http.FileServer(http.FS(webapp)))
  log.Fatal(http.ListenAndServe(":8080", a.r))
}

func (a *App) getAllUserInfo(w http.ResponseWriter, r *http.Request) {
  var users []user
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
