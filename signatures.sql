-- DROP TABLE IF EXISTS signatures;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS user_profiles;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(50) NOT NULL,
    last VARCHAR(50) NOT NULL,
    email VARCHAR(200) UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles(
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
age INT,
city VARCHAR(100),
homepage VARCHAR(300)
);


--run this command once when u create a table
-- SELECT * FROM signatures;

--we start a server, make a data base set in bash

--create the database once
-- run the create table command once
-- and every time you change the create table command
-- we run`
-- psql nameOfDatabase -f nameofFile.sql in Terminal
--
-- every other command will be run in our server we'' create in our db.js file
--
-- every signle function defined in db.js will be invoked in our index.js
