const express = require('express');
const router = express.Router();

// Redirect after Auth0 login
router.get('/callback', (req, res) => {
  const roles = req.oidc.user?.['https://npikem.com/roles'] || [];

  if (roles.includes('Manager')) {
    return res.redirect('/dashboard/manager');
  }

  return res.redirect('/dashboard');
});

module.exports = router;
