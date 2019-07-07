const express = require("express");
const hb = require("express-handlebars");
const db = require("./utils/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.static("./public"));
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);
app.use(require("cookie-parser")());

app.engine("handlebars", hb()); //telling what engine to use as template
app.set("view engine", "handlebars"); //parameters for express

app.use((req, res, next) => {
    if (req.cookies.signedPetition && req.url == "/petition") {
        res.redirect("/signed");
    } else {
        next();
    }
});

app.get("/petition", (req, res) => {
    res.render("petition", {
        layout: "main"
    });
});

app.get("/thank-you", (req, res) => {
    res.render("thank-you", {
        layout: "main"
    });
});

app.get("/signed", (req, res) => {
    res.render("signed", {
        layout: "main"
    });
});

app.post("/petition", (req, res) => {
    db.newSigner(req.body.first, req.body.last, req.body.signature)
        .then(val => {
            console.log("New person signed your petition!");
            res.cookie("signedPetition", "yes");
            res.redirect("/thank-you");
        })
        .catch(err => {
            console.log("error:", err);
        });
});

app.get("/signed", (req, res) => {
    db.allSigners().then(results => {
        console.log("All signers:", results.rows);
    });
});

app.listen(8080, () => console.log("Listening!"));

// app.get('/cities', (req, res) => {
//     db.getCities().then(results => {
//         console.log('Results.rows from db.cities:', results.rows);
//     });
// });

// app.post('/add-city', (req, res) => {
// //normally we'd handle here user's input. but now we're using postman:
// //we want to add Munich to our cities TABLE//we''l l need to write a query in out db.js fine and then we'll run it in the POST /add-city route
// db.addCity('Munich', 'DE').then(() => {
//         console.log('Yeah it worked!');
//     }).catch(err => {
//         console.log('error:', err);
//     });
// });
