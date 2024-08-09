async function isAuthorized(req, res, next) {
    const user = req.session.user;
    if (user) {
        return next();
    }
    else {
        return res.redirect('/users');
    }
}
module.exports = { isAuthorized }