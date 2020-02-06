const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

require("dotenv").config();

const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const app = express();
app.use(cors());
app.use(express.json());

const pgp = require("pg-promise")();
pgp.pg.defaults.ssl = true;
const db = pgp(DATABASE_URL);

// authorization middleware
const auth = (req,res,next) => {
    console.log(req.headers)
    next()
}

// login route - authenticate user
app.post("/login", (req,res) => {
    const username = req.body.user.username;
    const password = req.body.user.password;


    const token = jwt.sign({user: req.body.user.username}, JWT_SECRET)
    res.status(200).json({"token": token})
})

// register route - create a new user
app.post("/register", (req,res) => {
    const username = req.body.user.username;
    const password = req.body.user.password;
    db.oneOrNone("SELECT username FROM users WHERE username=$1", [username])
    .then(results => {
        if (!results) {
            // username is available, save to database
            bcrypt.hash(password, SALT_ROUNDS)
            .then(hash => {
                db.one("INSERT INTO users (username, hash) VALUES ($1, $2) RETURNING id;", [username, hash])
                .then(results => {
                    const token = jwt.sign({user: username, id: results.id}, JWT_SECRET)
                    res.status(200).json({"token": token, "id": results.id})
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).json({"message": "Error creating user."})
                })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({"message": "Error creating user."})
            })
        }
        else {
            res.status(500).json({"message": "Error creating user."})
        } 
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({"message": "Error creating user."})
    })
})

// locations route - returns a list of locations
app.get("/locations", auth, (req, res) => {
    db.any("SELECT id, lat, lon, date FROM locations ORDER BY id;")
    .then(results => {
        res.json(results);
    })
    .catch(error => {
        console.log(error)
    res.status(500).send();
    });

    res.json(locations);
});

// add route - add a new location to the database
app.post("/add", auth, (req,res) => {
    db.one("INSERT INTO locations (lat, lon) VALUES ($1, $2) RETURNING id, date;", [req.body.location.lat, req.body.location.lon])
        .then((results) => {
            res.status(200).json({"id": results.id, "date": results.date});
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