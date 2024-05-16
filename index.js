import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";

import {registerValidator, loginValidator, postCreateValidator, commentValidator} from './validator.js'
import { userController, postController, reactionController } from "./controllers/index.js";
import { checkAuth, handleValidatorErrors } from "./utils/index.js";

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('DB Connect'))
.catch((err) => console.log('DB Error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, 'uploads');
    },
    filename: (_, file, cb) =>{
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidator, handleValidatorErrors, userController.login);
app.post('/auth/register', registerValidator, handleValidatorErrors, userController.register);
app.get('/auth/profile', checkAuth, userController.profile);
app.get('/auth/me', checkAuth, userController.getMe);
app.get('/auth/user/:id', checkAuth, userController.getUser);
app.patch('/auth/user/:id/ban', checkAuth, userController.banUser);
app.patch('/auth/user/:id/moder', checkAuth, userController.moderUser);
app.delete('/auth/delete/:id', checkAuth, userController.remove);

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    });
});

app.post('/posts', checkAuth, postCreateValidator, handleValidatorErrors, postController.create);
app.get('/posts', postController.getAll);
app.get('/posts/:id', checkAuth, postController.getOne);
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidatorErrors, postController.update);
app.delete('/posts/:id', checkAuth, postController.remove);

app.get('/posts/:id/getAllPost', handleValidatorErrors, postController.getPostOnUserLike);

// app.post('/posts/', checkAuth, /*postCreateValidator, handleValidatorErrors, */postController.create);
// app.get('/posts', postController.getAll);
app.get('/popularPosts', postController.getPopularPosts);
app.get('/posts/user/me', checkAuth, postController.getAllPostUser)
// app.get('/posts/:id', postController.getOne);
// app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidatorErrors, postController.update);
// app.delete('/posts/:id', checkAuth, postController.remove);

app.post('/posts/:id/comments', checkAuth, commentValidator, handleValidatorErrors, reactionController.create);
app.get('/posts/:id/comments', reactionController.getAll);
app.patch('/comments/:id', checkAuth, commentValidator, handleValidatorErrors, reactionController.update);
app.delete('/comments/:id', checkAuth, reactionController.remove);
app.patch('/posts/:id/like', checkAuth, reactionController.like);

app.listen(process.env.PORT || 4444, (err) => {
    if (err){
        console.log(err);
    }
    console.log("Server Start");
});