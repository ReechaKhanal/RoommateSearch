package main

import (
	"gorm.io/gorm"
)

type Login struct {
	gorm.Model
	Username string
	Email    string `json:"email"`
	Password string `json:"password"`
	UserID   int
}

type User struct {
	gorm.Model
	Id              int
	Name            string
	Gender          string
	Age             int
	Occupation      string
	Image           string
	Place           Place
	Login_var       Login
	Email           string
	PhNumber        string
	HasPlace        bool
	Review          Review
	Preferences_var Preferences

	//Place       Place
	//Location [2]string
	//Review   map[string]string
}

type Review struct {
	gorm.Model
	cleanliness  int
	studious     int
	friendliness int
	UserID       int
}

type Preferences struct {
	gorm.Model
	UserID     int
	Gender     string
	Drinking   bool
	Smoking    bool
	Quite_time string
	Bed_time   string
	Pets       bool
	Occupation string
}

type Place struct {
	gorm.Model
	Id          int
	Name        string
	Images      string
	Latitude    float32 `sql:"type:decimal(8,6);"`
	Longitude   float32 `sql:"type:decimal(9,6);"`
	Price       float64
	Bedrooms    int
	Description string
	UserID      int
}

//func dummySet(db *gorm.DB) {
//
//	logins := []Login_var{
//		{Username: "Test User 1", Email: "testuser1@email.com", Password: "Testuser1", User_id: 0001},
//		{Username: "Test User 2", Email: "testuser2@email.com", Password: "Testuser2", User_id: 0002},
//	}
//	for _, l := range logins {
//		db.Create(&l)
//	}
//
//	users := []User{
//		{Id: 0001, Name: "Test User 1", Gender: "Female", Age: 22, Occupation: "Doctor", Place_id: 01},
//		{Id: 0002, Name: "Test User 2", Gender: "Male", Age: 22, Occupation: "Doctor", Place_id: 02},
//	}
//	for _, u := range users {
//		db.Create(&u)
//	}
//
//	preferences := []Preferences{
//		{User_id: 0001, Gender: "Male", Drinking: true, Smoking: false, Quite_time: "00:00 - 06:00", Pets: true, Occupation: "Architect"},
//		{User_id: 0002, Gender: "Male", Drinking: true, Smoking: false, Quite_time: "00:00 - 06:00", Pets: false, Occupation: "Lawyer"},
//	}
//	for _, p := range preferences {
//		db.Create(&p)
//	}
//
//	places := []Place{
//		{User_id: 0001, Id: 0001, Price: 1000, Bedrooms: 2, Description: "Newly Renovated Home"},
//		{User_id: 0002, Id: 0002, Price: 1500, Bedrooms: 3, Description: "Indoor pool available"},
//	}
//	for _, pl := range places {
//		db.Create(&pl)
//	}
//
//}

func setup(db *gorm.DB) {
	db.AutoMigrate(&User{}, &Login{}, &Preferences{}, &Place{})
	//The func is commented out because initial set of data is already added into the DB
	//dummySet(db)
}
