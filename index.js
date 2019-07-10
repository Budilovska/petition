const express = require("express");
const hb = require("express-handlebars");
const db = require("./utils/db");
const bc = require("./utils/bc");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");
const csurf = require("csurf");
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

app.use(csurf());

app.use((req, res, next) => {
    res.set("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use((req, res, next) => {
    if (req.session.signId && req.url == "/petition") {
        res.redirect("/signed");
    } else {
        next();
    }
});

app.get("/", (req, res) => {
    res.redirect("/register");
});

app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main"
    });
});

app.post("/register", (req, res) => {
        bc.hashPassword(req.body.password).then(hashPass => {
        // console.log("HASH IS:", hashPass);
                return db.registerUser(req.body.first, req.body.last, req.body.email, hashPass)
                .then(result => {
                    console.log("You have a new user");
                    req.session.newUserId = result.rows[0].id;
                    res.redirect("/profile");
            })
        })
        .catch(err => {
            console.log("error:", err);
        });
});

app.get("/log-in", (req, res) => {
    res.render("log-in", {
        layout: "main"
    });
});

app.post("/log-in", (req, res) => {
    // console.log(req.body.email);
    db.getPassword(req.body.email).then(hashPass => {
        // console.log("HASHPASS:", hashPass.rows[0].id);
        // console.log("HASH IS:", hashPass.rows[0].password);
        req.session.newUserId = hashPass.rows[0].id;
        if (hashPass.rows.length == 0) {
            res.render("log-in", {
                noEmail: true
            });
        }
        return bc.checkPassword(req.body.password, hashPass.rows[0].password).then(result => {
            if (result) {
                res.redirect("/petition");
            } else {
                res.render("log-in", {
                    invalid: true
                });
            }
        })
    })
    .catch(err => {
        console.log("error:", err);
    });
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});

app.post("/profile", (req, res) => {
    db.profileInfo(req.body.age, req.body.city, req.body.homepage).then(result => {
        res.redirect("/petition");
    }).catch(err => {
            console.log("error:", err);
        });
});


app.get("/petition", (req, res) => {
    db.getName(req.session.newUserId).then(name => {
        console.log(name);
        res.render("petition", {
            userName: name.rows[0].first,
            layout: "main"
        });
    })
    .catch(err => {
        console.log("error:", err);
    });
});

app.post("/petition", (req, res) => {
    db.newSigner(req.body.signature)
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

app.listen(process.env.PORT || 8080, () => console.log("Listening!"));

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

// var bcrypt = require('bcryptjs');
//
// function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
//     return new Promise(function(resolve, reject) {
//         bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(doesMatch);
//             }
//         });
//     });
// }
//
// if doesMatch is true, we let the user to log in, if it's false - the user can't login
//we pass to textEnteredInLoginForm the password that user put in the input field
