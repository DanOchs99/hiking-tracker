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
//pgp.pg.defaults.rejectUnauthorized = false;
const db = pgp(DATABASE_URL);

// authorization middleware
const auth = (req,res,next) => {
    // get the headers from this request
    const headers = req.headers['authorization'] // Bearer <token>
    if (headers) {
        const token = headers.split(' ')[1]
        // verify the token
        jwt.verify(token, JWT_SECRET, (error,decoded) => {
            if (error) {
                // unable to verify the token
                res.status(401).json({"status": "Authentication failed"})
            }
            else {
                // token verified
                req.headers['payload'] = decoded
                next();
            }
        })
    }
    else
    {
        res.status(401).json({"status": "Authentication failed"})
    }
}

// login route - authenticate user
app.post("/login", (req,res) => {
    const username = req.body.user.username;
    const password = req.body.user.password;
    db.oneOrNone("SELECT id, username, hash FROM users WHERE username=$1", [username])
    .then(results => {
        if (results) {
            // username found, check password
            bcrypt.compare(password, results.hash)
            .then(passwordsMatch => {
                if (passwordsMatch) {
                    // password good - send back a token
                    const token = jwt.sign({user: username, id: results.id}, JWT_SECRET)
                    res.status(200).json({"token": token, "id": results.id})
                }
                else {
                    // password did not match, send back an error 
                    res.status(401).json({"message": "Authentication failed"})
                }
            })
            .catch(error => {
                console.log(error)
                res.status(401).json({"message": "Authentication failed"})
            })
        }
        else {
            res.status(401).json({"message": "Authentication failed"})
        } 
    })
    .catch(error => {
        console.log(error)
        res.status(401).json({"message": "Authentication failed"})
    })
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
    db.any("SELECT id, lat, lon, date FROM locations WHERE user_id=$1 ORDER BY id;",[req.headers.payload.id])
    .then(results => {
        res.status(200).json(results);
    })
    .catch(error => {
        console.log(error)
        res.status(500).send();
    });
});

// add route - add a new location to the database
app.post("/add", auth, (req,res) => {
    db.none("INSERT INTO locations (lat, lon, user_id) VALUES ($1, $2, $3);", [req.body.location.lat, req.body.location.lon, req.headers.payload.id])
        .then((results) => {
            res.status(200).send();
        })
        .catch(error => {
            console.log(error)
            res.status(500).send();
        });
});

// delete route - remove a location from the database
app.post("/delete", auth, (req,res) => {
    db.none("DELETE FROM locations WHERE id=$1;", [req.body.id])
    .then(() => { res.status(200).send() })
    .catch(error => {
        console.log(error)
        res.status(500).send();
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});