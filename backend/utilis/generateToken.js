import jwt from 'jsonwebtoken';

const generateToken = (res, userId, userRole) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  const token = jwt.sign({ id: userId, role: userRole }, secret, {
    expiresIn: '30d',
  });

  // Set JWT as a secure, HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;