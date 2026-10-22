const User = require("../Models/User");
const Captain = require("../Models/Captain");
const jwt = require("jsonwebtoken");
const BlacklistTokenModel = require("../Models/blacklistToken");

function getToken(req, cookieName) {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.slice(7).trim();
  }
  return req.cookies?.[cookieName];
}

async function isTokenBlacklisted(token) {
  return Boolean(await BlacklistTokenModel.findOne({ token }));
}

async function authUser(req, res, next) {
  try {
    const token = getToken(req, "userToken");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: user token missing" });
    }

    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ message: "Unauthorized: token revoked" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired user token" });
  }
}

async function authCaptain(req, res, next) {
  try {
    const token = getToken(req, "captainToken");
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: captain token missing" });
    }

    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ message: "Unauthorized: token revoked" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await Captain.findById(decoded._id);

    if (!captain) {
      return res.status(401).json({ message: "Captain not found" });
    }

    req.captain = captain;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired captain token" });
  }
}

module.exports = { authUser, authCaptain };
