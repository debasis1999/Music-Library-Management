const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // Assuming req.user is populated from the auth middleware
    console.log(userRole);
    console.log('User Role:', req.user?.role);
    console.log('Allowed Roles:', allowedRoles);

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.log('Access Denied');
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
    }

    next();
  };
};

module.exports = roleMiddleware;
