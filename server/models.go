package main

import (
	"gorm.io/gorm"
)

type Login struct {
	gorm.Model
	username string
	email    string
	password string
	user_id  int
}

type User struct {
	gorm.Model
	id          int
	name        string
	gender      string
	age         int
	occupation  string
	preferences Preferences
	place_id    int
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
	id          int
	location    [2]string
	price       float64
	bedrooms    int
	Description string
}
