exports.requireLoggedOut = function(req, res, next) {
    if (req.session.newUserId) {
        return res.redirect('/petition')
    }
    next();
}

exports.requireSignature = function(req, res, next) {
    if(!req.session.signatureID) {
        return res.redirect('/petition')
    }
    next();
};

exports.requireNoSignature = function(req, res, next) {
    if(req.session.signatureId) {
        return res.redirect('/thank-you')
    }
    next();
}
