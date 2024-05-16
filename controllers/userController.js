import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from '../models/user.js'

export const register = async (req, res) => {
    try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log(req.body);

    const doc = new UserModel({
        name: req.body.name,
        login: req.body.login,
        email: req.body.email,
        passwordHash: hash,
        avatarUrl: req.body.avatarUrl,
        status: 'User',
    });

    const user = await doc.save();

    const token = jwt.sign(
        {
          _id: user._id,
        },
        'secretKey',
        {
          expiresIn: '30d',
        },
      );

    const {passwordHash, ...userData} = user._doc;

    res.json({
        userData,
        token,
    });
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Registration Error',
        });
    }
};

export const login = async (req, res) => {
    try {
    //     const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json(errors.array());
    // }
    
        const user = await UserModel.findOne({login: req.body.login});

        console.log(req.body);

        if (!user) {
            return res.status(404).json({
                message: 'User Not Found',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Incorrect login or password',
            });
        }

        const token = jwt.sign(
            {
              _id: user._id,
            },
            'secretKey',
            {
              expiresIn: '30d',
            },
          );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            userData,
            token,
        });

    } catch (err) {
         console.log(err);
        res.status(500).json({
            message: 'Login Error',
        });
    }
};

export const profile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User Not Found',
            });
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Me Error',
        });
    }
};

// export const getMe = async (req, res) => {
//     try {
//       const user = await UserModel.findById(req.userId);
  
//       if (!user) {
//         return res.status(404).json({
//           message: 'Пользователь не найден',
//         });
//       }
  
//       //const { passwordHash, ...userData } = user._doc;
  
//       res.json(user);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({
//         message: 'Нет доступа',
//       });
//     }
//   };

  export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.json({
                message: 'Такого юзера не существует.',
            })
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secretKey',
            { expiresIn: '30d' },
        )

        const { passwordHash, ...userData } = user._doc;

        res.json({
            userData,
            token,
        })
    } catch (error) {
        res.json({ message: 'Нет доступа.' })
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User Not Found',
            });
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Me Error',
        });
    }
};

export const banUser = async (req, res) => {
    try {
        const adminUser = await UserModel.findById(req.userId)

        if (adminUser.status != 'Administrator') {
            return res.status(400).json({
                message: 'Not admin',
            });
        }

        const user = await UserModel.findById(req.params.id)

        if (user.status == 'User') {
            user.status = 'Banned'
            user.save();
            res.json(true);
        } else if (user.status == 'Banned') {
            user.status = 'User'
            user.save();
            res.json(false);
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Me Error',
        });
    }
};

export const moderUser = async (req, res) => {
    try {
        const adminUser = await UserModel.findById(req.userId)

        if (adminUser.status != 'Administrator') {
            return res.status(400).json({
                message: 'Not admin',
            });
        }

        const user = await UserModel.findById(req.params.id)

        if (user.status == 'User') {
            user.status = 'Moderator'
            user.save();
            res.json(true);
        } else if (user.status == 'Moderator') {
            user.status = 'User'
            user.save();
            res.json(false);
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Me Error',
        });
    }
};

export const remove = async (req, res) => {
    try {

        const userAdmin = await UserModel.findById(req.userId);
        const userIdForDelete = req.params.id;
        
        if(userAdmin.status.valueOf() == "Administrator"){
        UserModel.findOneAndDelete({
            _id: userIdForDelete,
        }).then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found',
                });
            }

            res.json({
                success: true,
            });
        });
    } else {
        res.status(405).json({
            message: 'You not admin',
        });
    }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed remove user',
        });
    }
};
