// middleware/checkRole.js

module.exports = function checkRole(allowedRoles) {
  return function (req, res, next) {
    const user = req.oidc && req.oidc.user;
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    const roles = user['https://npikem.com/roles'] || [];
    const hasRole = allowedRoles.some(role => roles.includes(role));

    if (hasRole) {
      return next();
    } else {
      return res.status(403).send('Forbidden');
    }
  };
};
