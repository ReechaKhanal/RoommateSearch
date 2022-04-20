//go:build prod
// +build prod

package main

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed static
var static embed.FS

func (a *App) getHandle() http.Handler {
	webapp, err := fs.Sub(static, "static")
	if err != nil {
		panic(err)
	}
	a.r.PathPrefix("/").Handler(http.FileServer(http.FS(webapp)))
	return a.r
}
