var spicedPg = require("spiced-pg");
var db;

if(process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL)
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");
}


exports.allSigners = function() {
    return db.query("SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.homepage FROM users FULL OUTER JOIN user_profiles ON users.id = user_profiles.user_id");
};

exports.newSigner = function(user_id, signature) {
    return db.query(
        "INSERT INTO signatures (user_id, signature) VALUES ($1, $2)",
        [user_id, signature]
    );
};

exports.getImage = function(id) {
    return db.query("SELECT signature FROM signatures WHERE user_id=$1", [id]);
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

exports.getPasswordCheckIfSigned = function(email) {
    return db.query(
                "SELECT users.password, users.id, signatures.signature FROM users FULL OUTER JOIN signatures ON users.id = signatures.user_id WHERE users.email=$1", [email]);
};

exports.profileInfo = function(user_id, age, city, homepage) {
    return db.query(
        "INSERT INTO user_profiles (user_id, age, city, homepage) VALUES ($1, $2, $3, $4)",
        [user_id || null, age || null, city || null, homepage || null]
    );
};

exports.alreadySigned = function(id) {
    return db.query("SELECT users.first, signatures.signature FROM users FULL OUTER JOIN signatures ON users.id = signatures.user_id WHERE users.id=$1", [id]);
};


exports.profileFilledOut = function(id) {
    return db.query("SELECT user_profiles.age, user_profiles.city, user_profiles.homepage FROM user_profiles FULL OUTER JOIN users on users.id = user_profiles.user_id WHERE users.id=$1", [id]);
};

exports.cities = function(city) {
    return db.query("SELECT first, last, age, homepage FROM users FULL OUTER JOIN user_profiles ON users.id = user_profiles.user_id WHERE LOWER(user_profiles.city)=$1", [city]);
};

exports.deleteSignature = function(id) {
    return db.query("DELETE FROM signatures WHERE user_ID=$1", [id]);
};

exports.getAllProfileInfo = function(id) {
    return db.query("SELECT first, last, email, age, city, homepage, password FROM users FULL OUTER JOIN user_profiles ON users.id = user_profiles.user_id WHERE users.id=$1", [id]);
}

exports.updateUsers = function(id, first, last, email) {
    return db.query(
        "UPDATE users SET first=$2, last=$3, email=$4 WHERE id=$1",
        [id, first, last, email]
    );
};

exports.updateUserProfiles = function(user_id, age, city, homepage) {
    return db.query(
        "INSERT INTO user_profiles (user_id, age, city, homepage) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET age=$2, city=$3, homepage=$4",
        [user_id, age || null, city || null, homepage || null]
    );
};

exports.updateUsersWithPass = function(id, first, last, email, password) {
    return db.query(
        "UPDATE users SET first=$2, last=$3, email=$4, password=$5 WHERE id=$1",
        [id, first, last, email, password]
    );
};






//db.query returns a promise

//$1 syntax is used to prevent a type of attack called sequel injection
