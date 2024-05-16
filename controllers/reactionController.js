import PostModel from "../models/post.js";
import CommentModel from "../models/comment.js"
import UserModel from "../models/user.js"
import post from "../models/post.js";

export const like = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOne(
            {
                _id: postId,
            },
        ).populate({
            path: 'user',
            select: ['name', 'avatarUrl'],
        }
        ).then((post) => {

            if (!post.likeUser.some(ids => ids === req.userId)) {
                post.likeUser.push(req.userId);
                post.likesCount = post.likesCount + 1;
            } else {
                post.likeUser.splice(post.likeUser.indexOf(req.userId), 1);
                post.likesCount = post.likesCount - 1;
            };

            post.save();
            const likesCount = post.likesCount;
            res.json({ likesCount });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to find posts',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const postId = req.params.id;
        const comment = await CommentModel.find({ post: postId }).populate('post').populate({
            path: 'user',
            select: ['name', 'avatarUrl'],
        }).exec()

        res.json(comment);

    } catch (err) {
        console.log(err),
            res.status(500).json({
                message: 'Failed to find comment',
            });
    }
};

export const create = async (req, res) => {
    try {
        const postId = req.params.id;
        const currentPost = await PostModel.findById(postId);
        const currentUser = await UserModel.findById(req.userId);
        const doc = new CommentModel({
            text: req.body.text,
            user: {
                _id: currentUser._id,
                name: currentUser.name,
                avatarUrl: currentUser.avatarUrl,
            },
            post: postId,
        });

        const comment = await doc.save();

        const currentComment = {
            text: req.body.text,
            user: {
                _id: currentUser._id,
                name: currentUser.name,
                avatarUrl: currentUser.avatarUrl,
            },
            post: postId,
            commentsCount: currentPost.commentsCount + 1,
        };

        currentPost.commentsCount = currentPost.commentsCount + 1;
        currentPost.save();

        res.json(currentComment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create comment',
        });
    }
};

export const update = async (req, res) => {
    try {
        const commentId = req.params.id;

        await CommentModel.updateOne({
            _id: commentId,
        },
            {
                text: req.body.text,
                user: req.userId,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed update comment',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const commentId = req.params.id;

        const currentComment = await CommentModel.find({_id: commentId});
        const postId = currentComment[0].post._id;
        const currentPost = await PostModel.findById(postId);


        CommentModel.findOneAndDelete({
            _id: commentId,
        }).then((comment) => {
            if (!comment) {
                return res.status(404).json({
                    message: 'Comment not found',
                });
            }

            res.json({
                success: true,
            });
        });

        currentPost.commentsCount = currentPost.commentsCount - 1;
        currentPost.save();

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed remove comment',
        });
    }
};

export const getCommentByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const comment = await CommentModel.find({ user: userId });
        res.json(comment);
    } catch (err) {
        console.error(err);
        return [];
    }
};
