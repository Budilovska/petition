var spicedPg = require("spiced-pg");
var db;

if(process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL)
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");
}


exports.allSigners = function() {
    return db.query("SELECT * FROM signatures");
};

exports.newSigner = function(first, last, signature) {
    return db.query(
        "INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3) RETURNING id",
        [first, last, signature]
    );
};

exports.getImage = function(id) {
    return db.query("SELECT signature FROM signatures WHERE id = " + id);
};

exports.registerUser = function(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

exports.getPassword = function(email) {
    return db.query(
        "SELECT password FROM users WHERE email=$1", [email]);
};

exports.getEmail = function(email) {
    return db.query(
        "SELECT email FROM users WHERE email=$1", [email]);
};

// we have to envoke this function in our server:
// exports.getCities = function getCities() {
//     return db.query('SELECT * FROM cities');
// }

//db.query returns a promise

//$1 syntax is used to prevent a type of attack called sequel injection
// exports.addCity = function addCity(city, country) {  //it can be any words like funky chiken:D
//     return db.query('INSERT INTO cities (city, country) VALUES ($1, $2)', [ city, country ]);   //the array is the second argument with infos we need to pass
//
// };
