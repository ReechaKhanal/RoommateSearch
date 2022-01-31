package main

import (
	"embed"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
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

func (a *App) start(isDevMode bool) {
	err := a.db.AutoMigrate(&user{})
	if err != nil {
		panic("Failed to migrate database")
	}
	webapp, err := fs.Sub(static, "static")
	if err != nil {
		panic(err)
	}
	// DB functions
	a.r.HandleFunc("/getAllUserInfo", a.getAllUserInfo).Methods("GET")

	// If the dev flag is true, then enable CORS to allow for external web server interaction
	var handle http.Handler
	if isDevMode {
		c := cors.New(cors.Options{
			AllowedOrigins:   []string{"http://localhost:4200"},
			AllowCredentials: true,
		})
		handle = c.Handler(a.r)
	} else { // Production mode uses compiled static files and hosts the webpage
		a.r.PathPrefix("/").Handler(http.FileServer(http.FS(webapp)))
		handle = a.r
	}
	log.Fatal(http.ListenAndServe(":8080", handle))
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
