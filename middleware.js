// exports.requireLoggedOut = function(req, res, next) {
//     if (req.session.newUserId) {
//         return res.redirect('/petition')
//     }
//     next();
// }
//
// exports.requireSignature = function(req, res, next) {
//     if(!req.session.signatureID) {
//         return res.redirect('/petition')
//     }
//     next();
// };
//
// exports.requireNoSignature = function(req, res, next) {
//     if(req.session.signatureId) {
//         return res.redirect('/thank-you')
//     }
//     next();
// }

exports.notLoggedIn = function(req, res, next) {
    if (!req.session.newUserId && req.url != '/register' && req.url != '/log-in') {
        return res.redirect('/register')
    }
        next();
}

exports.loggedIn = (req, res, next) => {
    if (req.session.newUserId && req.url != '/thank-you') {
        return res.redirect('/thank-you');
    }
    next();
};
