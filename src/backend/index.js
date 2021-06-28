//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
var dbConn = require('./mysql-connector');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

// GET method to list all devices in frontend
// TODO: use filtering information from the select field to feed only the desired device types
app.get('/devices/', function (req, res, next) {

    dbConn.query('SELECT * FROM Devices', function (err, response) {
        if (err) {
            res.send(err).status(400);
        }
        res.send(JSON.stringify(response)).status(200);
    });

});

// POST method to update a device value from the dashboard
app.post('/value_update/', function (req, res) {

    // Get the POST data
    let id = req.body.id;
    let value = req.body.value;

    // Update the value for the selected device
    dbConn.query('UPDATE Devices SET state=? WHERE id=?', [value, id], function (err, respuesta) {
        if (err) {
            res.send(err).status(400);
        }
        res.send("Device value correctly updated");
    });
});

// POST method to delete a device
app.post('/delete/', function (req, res) {

    // Get the POST data (only ID is needed)
    let id = req.body.id;

    // Delete the device
    dbConn.query('DELETE FROM Devices WHERE id=?', [id], function (err, respuesta) {
        if (err) {
            res.send(err).status(400);
        }
        res.send(respuesta);
    });
});

// POST method to create a device
app.post('/create/', function (req, res) {

    // Get the POST data
    let dev = req.body.dev;
    let name = req.body.name;
    let description = req.body.description;
    let state = req.body.state;
    let type = req.body.type;

    dbConn.query('INSERT INTO Devices (name, description, state, type, dev) values(?,?,?,?,?)', [name, description, state, type, dev], function (err, respuesta) {
        if (err) {
            res.send(err).status(400);
        }
        res.send("Device added correctly");
    });
});

// POST method to update device information
app.post('/update/', function (req, res) {

    // Get the POST data (ID is needed)
    let id = req.body.id;
    let dev = req.body.dev;
    let name = req.body.name;
    let description = req.body.description;
    let type = req.body.type;

    // Update the device information
    dbConn.query('UPDATE Devices SET name=?, description=?, type=?, dev=? WHERE id=?', [name, description, type, dev, id], function (err, respuesta) {
        if (err) {
            res.send(err).status(400);
        }
        res.send("Device correctly updated");
    });
});

app.listen(PORT, function (req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
