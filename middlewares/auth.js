import Users from '../models/userModel.js';
import jwt from "jsonwebtoken";


export const auth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(' ')[1];

    if(!token) return res.status(401).json({ msg: "Xác thực không hợp lệ." });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await Users.findOne({ _id: decoded._id });

    if (!user) return res.status(401).json({ msg: "Xác thực không hợp lệ." });

    res.locals.auth = decoded;
    
    next();
} catch (err) {
    return res.status(401).json({ msg: "Xác thực không hợp lệ." });
}
};
