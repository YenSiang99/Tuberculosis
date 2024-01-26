// middleware/authorize.js
//determines whether the user has the valid roles to be able to view the api

const authorize = (requiredRoles = []) => {
  if (typeof requiredRoles === 'string') {
    requiredRoles = [requiredRoles]; // Convert to array if it's a single role
  }

  return (req, res, next) => {
    if (!req.user || !req.user.roles.some(role => requiredRoles.includes(role))) {
      // No user in request or user's roles do not include any of the required roles
      return res.status(403).send('Access denied');
    }

    next(); // User has at least one of the required roles, proceed to the next middleware or route handler
  };
};

module.exports = authorize;