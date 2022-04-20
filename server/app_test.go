package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gorilla/mux"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupApp() (*gorm.DB, App) {
	r := mux.NewRouter()
	db, err := gorm.Open(sqlite.Open("test1.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}
	setup(db)
	app := App{db: db, r: r}
	return db, app
}

func TestGetAllUserInfo(t *testing.T) {

	db, app := setupApp()
	//Get user info on the terminal
	var users []User
	db.Find(&users)

	req, err := http.NewRequest("GET", "/getAllUserInfo", nil)
	if err != nil {
		t.Fatal(err)
	}
	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(app.getAllUserInfo)

	// Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// directly and pass in our Request and ResponseRecorder.
	handler.ServeHTTP(rr, req)

	// Check if the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	//fmt.Println( (rr.Body))
	// Check if the response body is empty, Error should be thrown in this case
	if rr.Body.Len() <= 0 {
		t.Errorf("handler returned empty body")
	}
}

func TestLogin(t *testing.T) {
	_, app := setupApp()
	login := Login{
		Email:    "test@test.com",
		Password: "test123",
	}
	body, err := json.Marshal(login)
	req, err := http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	if err != nil {
		t.Fatal(err)
	}
	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(app.login)

	// Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// directly and pass in our Request and ResponseRecorder.
	handler.ServeHTTP(rr, req)

	// Check if the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}

func TestInvalidLogin(t *testing.T) {
	_, app := setupApp()
	login := Login{
		Email:    "123",
		Password: "abc",
	}
	body, err := json.Marshal(login)
	req, err := http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	if err != nil {
		t.Fatal(err)
	}
	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(app.login)

	// Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// directly and pass in our Request and ResponseRecorder.
	handler.ServeHTTP(rr, req)

	// Check if the status code is what we expect.
	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusBadRequest)
	}
}

func TestGetFilterDistance(t *testing.T) {
	_, app := setupApp()
	req, err := http.NewRequest("GET", "/getFilterDistance", nil)
	if err != nil {
		t.Fatal(err)
	}
	q := req.URL.Query()
	q.Add("latitude", "27.9477596282959")
	q.Add("longitude", "-82.45844268798828")
	q.Add("distance", "25")
	req.URL.RawQuery = q.Encode()
	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(app.getFilterDistance)

	// Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// directly and pass in our Request and ResponseRecorder.
	handler.ServeHTTP(rr, req)

	// Check if the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}

func TestGetLoggedInUser(t *testing.T) {
	_, app := setupApp()
	//Get user info on the terminal
	req, err := http.NewRequest("GET", "/getLoggedInUser", nil)
	if err != nil {
		t.Fatal(err)
	}
	expirationTime := time.Now().Add(5 * time.Minute)
	tokenString, err := createToken("test@test.com", expirationTime)
	req.AddCookie(&http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})
	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(app.getLoggedInUser)

	// Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// directly and pass in our Request and ResponseRecorder.
	handler.ServeHTTP(rr, req)

	// Check if the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}
