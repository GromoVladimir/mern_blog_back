import PostModel from "../models/post.js";
import UserModel from "../models/user.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().sort('-createdAt').populate({
            path: 'user',
            select: ['name', 'avatarUrl'],
          });

        res.json(posts);

    } catch(err) {
        console.log(err),
        res.status(500).json({
            message: 'Failed to find posts',
        });
    }
};

export const getPopularPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).sort('-viewsCount')

        res.json(posts);

    } catch(err) {
        console.log(err),
        res.status(500).json({
            message: 'Failed to find popular posts',
        });
    }
}

export const getAllPostUser = async (req, res) => {
    try {
        const currentUser = UserModel.findById(req.userId);
        const posts = await PostModel.find({ user: req.userId })
        .populate({
            path: 'user',
            select: ['name', 'avatarUrl'],
          });

        res.json(posts);

    } catch(err) {
        console.log(err),
        res.status(500).json({
            message: 'Failed to find posts',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const currentPost = await PostModel.findById(postId)
        
        if (currentPost?._id == postId) {
            PostModel.findOneAndUpdate(
            {
                _id: postId,
            }, 
            {
                $inc: {viewsCount: 1},
            }, 
            {
                returnDocument: 'after',
            },
            ).populate({
                path: 'user',
                select: ['name', 'avatarUrl', 'status'],
            }
            ).then((post) => {

                if (!post) {
                    return res.status(404).json({
                        message: 'Post not found',
                    });
                }

                res.json(post);
            });
        } else {
            return res.status(404).json({
                message: 'Post not found',
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to find posts',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        
        PostModel.findOneAndDelete({
            _id: postId,
        }).then((post) => {
            if (!post) {
                return res.status(404).json({
                    message: 'Post not found',
                });
            }

            res.json({
                success: true,
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed remove post',
        });
    }
};

export const create = async (req, res) => {
try {
    console.log('Создан пост')
    const doc = new PostModel({
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
} catch (err) {
    console.log(err);
    res.status(500).json({
        message: 'Failed to create post',
    });
}
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        
        await PostModel.updateOne({
            _id: postId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
        },
        );

        

        res.json({
            _id: postId,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed update post',
        });
    }
};


export const getPostOnUserLike = async (req, res) => {
    try {
        const userId = req.params.id;
        const post = await PostModel.find({ likeUser: userId });
        res.json(post);
    } catch (err) {
        console.error(err);
        return [];
    }
  };

  export const getPostByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const post = await PostModel.find({ user: userId });
        res.json(post);
    } catch (err) {
        console.error(err);
        return [];
    }
  };

 export const getAllPostByLike = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({
            path: 'user',
            select: ['name', 'avatarUrl'],
        }).sort({'likesCount': -1});

        res.json(posts);

    } catch(err) {
        console.log(err),
        res.status(500).json({
            message: 'Failed to find posts',
        });
    }
};

export const getPostByNameAndTags = async (req, res) => {
    try {
        const titlePost = req.params.postName;
        const tagsPost = req.params.tagsList;
        const post = await PostModel.find({ title: titlePost, tags: tagsPost });
        res.json(post);
    } catch (err) {
        console.error(err);
        return [];
    }
  };

 

