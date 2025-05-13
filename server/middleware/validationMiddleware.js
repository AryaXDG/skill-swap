import { body, validationResult } from 'express-validator';

// --- Validation Rules ---

export const registerRules = [
  body('username', 'Username is required').notEmpty().trim().escape(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
];

export const loginRules = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists(),
];

export const profileSkillsRules = [
    body('skills_possessed', 'Skills possessed must be an array').isArray(),
    body('skills_seeking', 'Skills seeking must be an array').isArray(),
    body('skills_possessed.*.skill', 'Invalid skill ID').isMongoId(),
    body('skills_possessed.*.proficiency', 'Invalid proficiency').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
    body('skills_seeking.*.skill', 'Invalid skill ID').isMongoId(),
];

export const ratingRules = [ // NEW Rules
    body('helpfulness', 'Helpfulness rating (1-5) is required').isFloat({ min: 1, max: 5 }),
    body('politeness', 'Politeness rating (1-5) is required').isFloat({ min: 1, max: 5 }),
    body('comment', 'Comment must be under 500 characters').optional().isLength({ max: 500 }).trim().escape(),
];

// --- Validation Handler ---

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map(err => ({ [err.path]: err.msg }));

  return res.status(422).json({
    status: "error",
    message: "Validation failed",
    errors: extractedErrors,
  });
};