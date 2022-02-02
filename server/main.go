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

}
