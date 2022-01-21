package main

import (
  "github.com/gorilla/mux"
  "gorm.io/gorm"
)

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
}
