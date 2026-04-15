import { verifyJWT } from "../utils/tokenutils.js";
import { UnauthenticatedError, UnauthorizedError } from "../errors/costomerrors.js";

export const authenticateUser = (req, res, next) => {
  // Support both cookie-based and Bearer token auth
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) throw new UnauthenticatedError("Authentication invalid - no token provided");

  try {
    const { userId, role } = verifyJWT(token);
    req.patient = { userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid - token expired or malformed");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.patient.role)) {
      throw new UnauthorizedError("Not authorized to access this route");
    }
    next();
  };
};
