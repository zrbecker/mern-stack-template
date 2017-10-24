# MERN Stack Template

This is a template for a MERN (mongodb, express, react, nodejs) application.

Currently it is not using mongodb.

It launches the client with `webpack-dev-server` and the server with `nodemon`.
It then uses `webpack-dev-server` proxy settings to direct `/api` to the server.

If you do `npm install; npm start` from the root package, it should start the
server on http://localhost:4000.
