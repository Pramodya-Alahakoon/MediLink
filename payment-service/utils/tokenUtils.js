import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

export const generateToken = (userId, role) => {
  try {
    const token = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return token;
  } catch (error) {
    throw new Error(`Failed to generate token: ${error.message}`);
  }
};

export default {
  verifyToken,
  generateToken,
};
