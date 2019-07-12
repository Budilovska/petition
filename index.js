const express = require("express");
const app = exports.app = express();
const hb = require("express-handlebars");
const db = require("./utils/db");
const bc = require("./utils/bc");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");
// const {requireLoggedOut,
//         requireSignature, requireNoSignature} = require('./middleware');
const csurf = require("csurf");

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

// app.use((req, res, next) => {
// //check to see if they're loged in - send them to register, if they're loged in - let them go wherevver they need
// if (!req.session.newUserId && req.url !="/register" && eq.url !="/log-in") {
//     res.redirect("/register")
// } else {
//     next();
// }
// });


app.engine("handlebars", hb());
app.set("view engine", "handlebars");
//
// app.use((req, res, next) => {
//     if (req.session.signatureId && req.url == "/petition") {
//         res.redirect("/signed");
//     } else {
//         next();
//     }
// });

app.get("/", (req, res) => {
    res.redirect("/register");
});

// function requireLoggedOut(req, res, next) {
//     if (req.session.newUserId) {
//         return res.redirect('/petition')
//     }
//     next();
// }

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
    db.getPasswordCheckIfSigned(req.body.email).then(infos => {
        // console.log("infos.rows[0].signature", infos.rows[0].signature);
        req.session.newUserId = infos.rows[0].id;
        if (infos.rows[0].signature == null) {
            console.log("HAS NOT SIGNED YET");
            res.redirect("/petition");
        } else {
            req.session.signatureId = true;
            res.redirect("/thank-you");
        }
        return bc.checkPassword(req.body.password, infos.rows[0].password)
        .then(result => {
            if (!result) {
                res.render("log-in", {
                    invalid: true
                }); //closes render
            } //closes else
        })  //closes then
    }) //closes  getPassword
    .catch(err => {
        console.log("error:", err);
        res.render("log-in", {
                noEmail: true
            }); //closes render
    }); //closes catch
}); //closes post

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/register');
});


app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});

app.post("/profile", (req, res) => {
    db.profileFilledOut(req.session.newUserId).then(info => {
        if (info.rows[0].age != null && info.rows[0].city != null && info.rows[0].homepage != null) {
            res.redirect("/petition");
        } else {
            if (req.body.homepage.startsWith("http://")) {
                req.body.homepage = "http://" + req.body.website;
            }
            return db.profileInfo(req.session.newUserId, req.body.age, req.body.city, req.body.homepage).then(result => {
                console.log("result is", result);
                res.redirect("/petition");
            }).catch(err => {
                    console.log("error:", err);
                    res.redirect("/petition");
                });
        }

});
});


// function hasSigned(req, res, next) {
//     return db.alreadySigned(req.session.newUserId).then(result => {
//         console.log("RESULT IS:", result);
//         if (result.rows[0].signature == null) {
//             console.log("NOT SIGNED YET");
//             next();
//         } else {
//             console.log("SIGNED");
//             res.redirect("/thank-you");
//         }
//     })
// }



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


//  function requireNoSignature(req, res, next) {
//     if(req.session.signatureId) {
//         return res.redirect('/thank-you')
//     }
//     next();
// }

app.post("/petition", (req, res) => {
    db.newSigner(req.session.newUserId, req.body.signature)
        .then(result => {
            console.log("New person signed your petition!");
            req.session.signatureId = true;
            res.redirect("/thank-you");
        })
        .catch(err => {
            console.log("error:", err);
        });
});

app.get("/thank-you", (req, res) => {
    db.allSigners()
        .then(total => {
            console.log("req.session.newUserId", req.session.newUserId);
            return db.getImage(req.session.newUserId).then(result => {
                // console.log("LAST RESULT:", result);
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
            // console.log("ALL SIGNERS:", signers);
            res.render("signed", {
                signers: signers.rows,
                layout: "main"
            });
        })
        .catch(err => {
            console.log("error:", err);
        });
});

// app.get("/signed/:city")


if (require.main == module) {
app.listen(process.env.PORT || 8080, () => console.log("Listening!"));
}


















// app.post('/add-city', (req, res) => {
// //normally we'd handle here user's input. but now we're using postman:
// //we want to add Munich to our cities TABLE//we''l l need to write a query in out db.js fine and then we'll run it in the POST /add-city route
// db.addCity('Munich', 'DE').then(() => {
//         console.log('Yeah it worked!');
//     }).catch(err => {
//         console.log('error:', err);
//     });
// });
