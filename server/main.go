package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gorilla/mux"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	//For logging errors
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: false,
			Colorful:                  true,
		},
	)

	// I used sqlite for now since it's simple, but we should switch to something else later
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{Logger: newLogger})
	if err != nil {
		panic("Failed to connect to database")
	}
	setup(db)
	var loginDetail []Login
	db.Find(&loginDetail)
	for _, l := range loginDetail {
		fmt.Println("Email: ", l.email, "Password: ", l.password)
	}

	// Router to handle server requests, currently unused
	r := mux.NewRouter()
	app := App{db: db, r: r}
	app.start()
}
