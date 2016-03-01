var express = require('express');
var router = express.Router();
var path = require('path');

var pg = require('pg');
//var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

// ==========================
// database.js
// var pg = require('pg');
// var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

// var client = new pg.Client(connectionString);
// client.connect();
// var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', function() { client.end(); });

// ==========================
// Function  URL Action
// CREATE  /api/v1/todos           Create a single todo
// READ  /api/v1/todos             Get all todos
// UPDATE  /api/v1/todos/:todo_id  Update a single todo
// DELETE  /api/v1/todos/:todo_id  Delete a single todo

// root
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// Lets update the main route in index.js within the "routes" folder:
// So when the end user hits the main endpoint,
// we send the index.html file.
// This file will contain our HTML and Angular templates.
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});



/*  CREATE  /api/v1/todos           Create a single todo   */
router.post('/api/v1/todos', function(req, res) {

    var results = [];

    console.log("inside POST /api/v1/todos");

    // Grab data from http request
    var data = {text: req.body.text, complete: false};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});

// READ  /api/v1/todos             Get all todos
router.get('/api/v1/todos', function(req, res) {

    var results = [];

    console.log("inside GET /api/v1/todos");

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

});

// UPDATE  /api/v1/todos             Get all todos
router.put('/api/v1/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;

    // Grab data from http request
    var data = {text: req.body.text, complete: req.body.complete};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

// DELETE  /api/v1/todos/:todo_id  Delete a single todo

router.delete('/api/v1/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM items WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

module.exports = router;
