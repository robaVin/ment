module.exports = function requireManager(req, res, next) {
  const user = req.oidc.user;

  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/auth/login');
  }

  const roles = user && user['https://npikem.com/roles'];

  if (Array.isArray(roles) && roles.includes('Manager')) {
    return next();
  }

  return res.status(403).send('Access denied. Managers only.');
};
