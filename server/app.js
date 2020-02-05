const express = require("express");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();
app.use(cors());
app.use(express.json());

const pgp = require("pg-promise")();
pgp.pg.defaults.ssl = true;
const db = pgp(DATABASE_URL);

// locations route - returns a list of locations
/*
app.get("/locations", (req, res) => {
    //TODO: wire up to database...
    //db.any("SELECT id, title, genre, publisher, year, imageurl FROM books ORDER BY id;")
    //.then(results => {
    //    res.json(results);
    //})
    //.catch(error => {
    //    console.log(error)
    //    res.status(500).send();
    //});
   let timestamp = new Date();
   let locations = [{lat: 40.785091, lon: -73.968285, date: timestamp}]

   res.json(locations);
});
*/

// add route - add a new location to the database
app.post("/add", (req,res) => {
    db.none("INSERT INTO locations (lat, lon, date) VALUES ($1, $2, $3);", [req.body.location.lat, req.body.location.lon, req.body.location.date])
        .then(() => {
            // TODO: send back the location with the db id here!!
            res.status(200).json({"id": "1"});
        })
        .catch(error => {
            console.log(error)
            res.status(500).send();
        });
});

// delete route - remove a location from the database
//app.post("/delete", (req,res) => {
//    console.log(body.id);
//});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});