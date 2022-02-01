package main

import (
  "github.com/gorilla/mux"
  "gorm.io/driver/sqlite"
  "gorm.io/gorm"
)

func main() {
  // I used sqlite for now since it's simple, but we should switch to something else later
  db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
  if err != nil {
    panic("Failed to connect to database")
  }
  // Router to handle server requests, currently unused
  r := mux.NewRouter()
  app := App{db: db, r: r}
  app.start()
}
