import Session from "../models/Session.model.js";

const authMiddleware = async (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.session?.user) return next();
    return res.status(401).send({ message: "You are not authorized" });
  }

  try {
    if (req.session?.user) return next();

    const sessionRecord = await Session.findOne({})
      .sort({ expires: -1 })
      .lean();
    if (!sessionRecord) {
      return res.status(401).send({ message: "You are not authorized" });
    }

    const sessionData = JSON.parse(sessionRecord.session);
    if (!sessionData?.user?.id || !sessionData?.user?.login) {
      return res.status(401).send({ message: "You are not authorized" });
    }

    req.session.user = {
      id: sessionData.user.id,
      login: sessionData.user.login,
    };
    next();
  } catch {
    return res.status(401).send({ message: "You are not authorized" });
  }
};

export default authMiddleware;
