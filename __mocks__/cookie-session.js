let tempSession, session = {};

module.exports = () => (req, res, next) => {
    req.session = tempSession || session;
    tempSession = null;
    next();
};

module.exports.mockSession = sess => session = sess;

module.exports.mockSessionOnce = sess => tempSession = sess;
