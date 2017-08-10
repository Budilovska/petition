module.exports = () => (req, res, next) => {
    req.csrfToken = () => {};
    next();
};
