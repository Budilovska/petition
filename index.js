const express = require("express");
const hb = require("express-handlebars");
const db = require("./utils/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");
const app = express();

app.use(express.static("./public"));
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);
app.use(require("cookie-parser")());

app.use(
    cookieSession({
        secret: `I'm always hungry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14 //in two weeks cookie will be deleted
    })
);

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use((req, res, next) => {
    if (req.session.signId && req.url == "/petition") {
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

app.post("/petition", (req, res) => {
    db.newSigner(req.body.first, req.body.last, req.body.signature)
        .then(result => {
            console.log("New person signed your petition!");
            req.session.signId = result.rows[0].id;
            res.redirect("/thank-you");
        })
        .catch(err => {
            console.log("error:", err);
        });
});

app.get("/thank-you", (req, res) => {
    db.allSigners()
        .then(total => {
            return db.getImage(req.session.signId).then(result => {
                console.log(result.rows[0].signature);
                res.render("thank-you", {
                    image: result.rows[0].signature,
                    total: total.rowCount,
                    layout: "main"
                });
            });
        })
        .catch(err => {
            console.log("error:", err);
        });
});

app.get("/signed", (req, res) => {
    db.allSigners()
        .then(signers => {
            console.log("ALL SIGNERS:", signers.rows);
            res.render("signed", {
                signers: signers.rows,
                layout: "main"
            });
        })
        .catch(err => {
            console.log("error:", err);
        });

    //pull out id and signature here
    //once you have a big signature url in this route,
    // you can render it on screen by putting it in an image tag
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

//cookies are tiny, they can only store about 4kb
//the signature is too big to store it in our cookie:
// We can store an id of the signature

// console.log(req.session.signId);
// put data in my cookie:
// req.session.sigId = true; //instead of res.cookie
// req.session.muffin = 'blueberry';
// req.session.sigId = 58; //we need to make ID 58 ore dynamic
// figure out id that was just generated and pass it to this number
