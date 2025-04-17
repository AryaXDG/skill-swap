import jwt from 'jsonwebtoken';

// Helper to generate token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Placeholder for later use:
// export const registerUser = async (req, res) => { /* ... */ };
// export const loginUser = async (req, res) => { /* ... */ };
// export const getMe = async (req, res) => { /* ... */ };