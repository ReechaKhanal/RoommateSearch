package main

import (
  "testing"
  "net/http"
  "net/http/httptest"
  "fmt"
)

func TestGetAllUserInfo(t *testing.T){

  req, err := http.NewRequest("GET", "/getAllUserInfo", nil)
  if err != nil {
    t.Fatal(err)
  }
  // We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
  rr := httptest.NewRecorder()
  handler := http.HandlerFunc(GetAllUserInfo)

  // Our handlers satisfy http.Handler, so we can call their ServeHTTP method
  // directly and pass in our Request and ResponseRecorder.
  handler.ServeHTTP(rr, req)

  // Check if the status code is what we expect.
  if status := rr.Code; status != http.StatusOK {
    t.Errorf("handler returned wrong status code: got %v want %v",
        status, http.StatusOK)
  }

  fmt.Printf(rr.Body.String())
  // Check if the response body is what we expect
  //expected := {"alive": true}
  //if rr.Body.String() != expected {
  //  t.Errorf("handler returned unexpected body: got %v want %v",
  //      rr.Body.String(), expected)
  //}
}
