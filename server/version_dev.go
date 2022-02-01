//go:build !prod
// +build !prod

package main

import (
	"github.com/rs/cors"
	"net/http"
)

func (a *App) getHandle() http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200"},
		AllowCredentials: true,
	})
	return c.Handler(a.r)
}
