const express = require("express");

require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();

// locations route - returns a list of locations
app.get("/locations", (req, res) => {
    //TODO: wire up to database...
    /*
    db.any("SELECT id, title, genre, publisher, year, imageurl FROM books ORDER BY id;")
    .then(results => {
        res.json(results);
    })
    .catch(error => {
        console.log(error)
        res.status(500).send();
    });
    */
   let timestamp = new Date();
   let locations = [{lat: 40.785091, lon: -73.968285, date: timestamp}]

   res.json(locations);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});