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

exports.newSigner = function(signature) {
    return db.query(
        "INSERT INTO signatures (signature) VALUES ($1) RETURNING id",
        [signature]
    );
};

exports.getImage = function(id) {
    return db.query("SELECT signature FROM signatures WHERE id=$1", [id]);
};

exports.registerUser = function(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

exports.getName = function(id) {
    return db.query(
        "SELECT first FROM users WHERE id=$1", [id]);
};

exports.getPassword = function(email) {
    return db.query(
        "SELECT password, id FROM users WHERE email=$1", [email]);
};

exports.getEmail = function(email) {
    return db.query(
        "SELECT email FROM users WHERE email=$1", [email]);
};

exports.profileInfo = function(age, city, homepage) {
    return db.query(
        "INSERT INTO user_profiles (age, city, homepage) VALUES ($1, $2, $3)",
        [age, city, homepage]
    );
};

// exports.joinUsersSign = function(id) {
//     return db.query("SELECT users.first, users.last, users.email, users.password FROM users JOIN signatures ON users.id = signatures.user_id");
// }
//
// SELECT users.first, signature FROM users FULL OUTER JOIN signatures on users.id = signatures.user_id;

// exports.getNameAndSignature = function(id) {
//     return db.query(`SELECT first, signature FROM users FULL OUTER JOIN signatures on users.id = signatures.user_ID WHERE users.id='${id}'`);
// };



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
