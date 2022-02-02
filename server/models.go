package main

import (
	"gorm.io/gorm"
)

type Login struct {
	gorm.Model
	username string
	email    string
	password string
	user_id  int `gorm:"primaryKey"`
}

type User struct {
	gorm.Model
	id          int `gorm:"primaryKey"`
	name        string
	gender      string
	age         int
	occupation  string
	preferences Preferences
	place_id    int
	place       Place `gorm:"foreignKey:place_id"`
	location    [2]string
	review      map[string]string
}

type Preferences struct {
	gorm.Model
	gender     string
	drinking   bool
	smoking    bool
	quite_time string
	pets       bool
	occupation [5]string
}

type Place struct {
	gorm.Model
	id          int `gorm:"primaryKey"`
	location    [2]string
	price       float64
	bedrooms    int
	Description string
}

//func to setup tables and migrate the schema
func setup(db *gorm.DB) {
	db.AutoMigrate(&Login{}, &User{}, &Preferences{}, &Place{})
	dummySet(db)
}

//initial set of dummy data
func dummySet(db *gorm.DB) {
	userLogin := []Login{
		{
			username: "Test User 1",
			email:    "testuser1@email.com",
			password: "testuser1",
			user_id:  0001,
		},

		{
			username: "Test User 2",
			email:    "testuser2@email.com",
			password: "testuser2",
			user_id:  0002,
		},
	}
	for _, c := range userLogin {
		db.Create(&c)
	}

	var user Login
	db.First(&user, "username = ?", "Test User 1")

}
