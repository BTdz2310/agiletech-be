import { createAccessToken, createRefreshToken } from '../utils/utils.js';
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
    try{

        const {username} = req.body;

        let user;

        user = await User.findOne({
            username: username
        })

        if(!user){
            user = await User.create({
                username: username
            })
        }

        const access_token = createAccessToken({ _id: user._id});

        const refresh_token = createRefreshToken({ _id: user._id });

        res.cookie('refreshToken', refresh_token, {
            httpOnly: true,
            secure: true, 
            // secure: false,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

        return res.status(200).json({
            access_token
        })

    }catch(error){
        return res.status(500).json({
            msg: error
        })
    }
}

export const refreshToken = async (req, res) => {
    const cookies = req.cookies;
    let cookieName = 'refreshToken';

    // console.log(cookies)

    if (!cookies) {
        return res.status(401).json({ message: "Unauthorized0" });
      }
  
    if (cookies && !cookies[cookieName]) {
      return res.status(401).json({ message: "Unauthorized0" });
    }

    const refreshToken = cookies[cookieName];

    try {
      const refreshTokenDecoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  
      if (!refreshTokenDecoded) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const foundUser = await User.findOne({ _id: refreshTokenDecoded._id });
  
      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
  
      const access_token = createAccessToken({ _id: foundUser._id });
  
      res.status(200).json({ 
            access_token
       });
    } catch (error) {
        console.log(error)
      return res.status(500).json({
        msg: error
      });
    }
};

export const logout = (req, res) => {
    res.clearCookie('refreshToken');
    return res.status(200).json({
        msg: 'Success'
    })
}
