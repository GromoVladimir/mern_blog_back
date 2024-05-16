import { body } from "express-validator";

export const registerValidator = [
    body('login', 'Login must be longer than 3 symbols').isLength({ min: 4}),
    body("email", "Invalid email").isEmail(),
    body('password', 'Password must be longer than 3 symbols').isLength({ min: 4}),
    body('name', 'Name must be longer than 2 symbols').isLength({ min: 3}),
    body("avatarUrl", "Invalid link on avatar").optional().isString(),
];

export const loginValidator = [
    body('login', 'Login must be longer than 3 symbols').isLength({ min: 4}),
    body('password', 'Password must be longer than 3 symbols').isLength({ min: 4}),
];

export const postCreateValidator = [
    body('title', 'Title must be longer than 3 symbols').isLength({ min: 4}),
    body('text', 'Text must be longer than 3 symbols').isLength({ min: 4}),
    body('tags', 'Invalid tags format').optional().isArray(),
    body('imageUrl', 'Invalid link').optional().isString(),
];

export const commentValidator = [
    body('text', 'Text must be longer than 1 symbols').isLength({ min: 2}),
];