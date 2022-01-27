package main

import (
	"embed"
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
	a.r.PathPrefix("/").Handler(http.FileServer(http.FS(webapp)))
	log.Fatal(http.ListenAndServe(":8080", a.r))
}
