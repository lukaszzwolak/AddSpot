import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

export const register = async (req, res) => {
  try {
    const { login, password, email, firstName, lastName } = req.body;

    if (
      typeof login !== "string" ||
      typeof password !== "string" ||
      !login.trim() ||
      !password
    ) {
      return res.status(400).send({ message: "Bad request" });
    }

    const normalizedLogin = login.trim().toLowerCase();
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : undefined;

    if (normalizedLogin.length < 3) {
      return res.status(400).send({ message: "Login too short" });
    }
    if (password.length < 6) {
      return res.status(400).send({ message: "Password too short" });
    }

    const existing = await User.findOne({
      $or: [
        { login: normalizedLogin },
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
      ],
    });
    if (existing) {
      return res
        .status(409)
        .send({ message: "User with this login/email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const avatar = req.file ? req.file.filename : undefined;

    const user = await User.create({
      login: normalizedLogin,
      email: normalizedEmail,
      password: hashed,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      avatar,
    });

    return res.status(201).send({
      message: "User created",
      user: { id: user._id, login: user.login, email: user.email },
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res
        .status(409)
        .send({ message: "User with this login/email already exists" });
    }
    console.error(err);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (
      login &&
      typeof login === "string" &&
      password &&
      typeof password === "string"
    ) {
      const user = await User.findOne({ login: login.trim().toLowerCase() });
      if (!user) {
        return res
          .status(400)
          .send({ message: "Login or password are incorrect" });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res
          .status(400)
          .send({ message: "Login or password are incorrect" });
      }

      return res.status(200).send({ message: "Login successful" });
    } else {
      return res.status(400).send({ message: "Bad request" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal server error" });
  }
};
