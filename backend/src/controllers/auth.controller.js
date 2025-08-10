import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (typeof login !== "string" || typeof password !== "string") {
      return res.status(400).send({ message: "Bad request" });
    }
    const trimmedLogin = login.trim();
    if (trimmedLogin.length < 3 || password.length < 6) {
      return res.status(400).send({ message: "Login or password too short" });
    }

    const existing = await User.findOne({ login: trimmedLogin });
    if (existing) {
      return res
        .status(409)
        .send({ message: "User with this login already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const avatar = req.file ? req.file.filename : undefined;

    const user = await User.create({
      login: trimmedLogin,
      password: hashed,
      avatar,
    });

    return res
      .status(201)
      .send({ message: "User created", login: user.login, id: user._id });
  } catch (err) {
    if (err && err.code === 11000) {
      return res
        .status(409)
        .send({ message: "User with this login already exists" });
    }
    console.error(err);
    return res.status(500).send({ message: "Internal server error" });
  }
};
