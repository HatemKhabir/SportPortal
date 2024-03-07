import jwt from "jsonwebtoken";
import Player from "../db/models/playerModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Player.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json("Not Authorized");
    }
  }

  if (!token) {
    res.status(401).json("Not Authorized");
  }
}

