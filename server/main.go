package main

import (
  "fmt"
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

  db.AutoMigrate(&user{})
  db.Create(&user{Name:"Reecha"})

  // Read
  var u1 user
  db.First(&u1) // find the first row in the user table

  rows := db.First(&u1)
  fmt.Println(rows.RowsAffected)


	// Router to handle server requests, currently unused
	r := mux.NewRouter()
	app := App{db: db, r: r}
	app.start()
}
