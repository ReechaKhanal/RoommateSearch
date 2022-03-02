package main

import (
  "testing"
  "net/http"
  "net/http/httptest"

	"github.com/gorilla/mux"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestGetAllUserInfo(t *testing.T){

  r := mux.NewRouter()
  db, err := gorm.Open(sqlite.Open("test1.db"), &gorm.Config{})
  if err != nil {
    panic("Failed to connect to database")
  }

  setup(db)
  //Get user info on the terminal
  var users []User
  db.Find(&users)
  // for _, u := range users {
  //   fmt.Println("Name:", u.Name, "Gender:", u.Gender, "Age:", u.Age)
  // }
  app := App{db: db, r: r}

  req, err := http.NewRequest("GET", "/GetAllUserInfo", nil)
  if err != nil {
    t.Fatal(err)
  }
  // We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
  rr := httptest.NewRecorder()
  handler := http.HandlerFunc(app.GetAllUserInfo)

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
  if rr.Body.Len() <= 0{
    t.Errorf("handler returned empty body")
  }
}
