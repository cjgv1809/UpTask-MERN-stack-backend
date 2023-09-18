import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";
import { registerEmail, forgotPasswordEmail } from "../helpers/email.js";

const register = async (req, res) => {
  // prevent duplicate emails
  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  try {
    const user = new User(req.body);
    user.token = generateId();
    await user.save();
    // send email to user
    registerEmail({ email: user.email, name: user.name, token: user.token });
    res.json({
      message:
        "Usuario creado correctamente, por favor revisa tu email para confirmar tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "El usuario no existe" });
  }

  // check if user is confirmed
  if (!user.confirmed) {
    return res
      .status(403)
      .json({ message: "Tu cuenta no ha sido confirmada aun" });
  }

  // check if password is correct
  const correctPassword = await user.matchPassword(password);
  if (correctPassword) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id),
    });
  } else {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }
};

const confirmEmail = async (req, res) => {
  const { token } = req.params;

  // check if user exists
  const user = await User.findOne({ token });
  if (!user) {
    return res.status(403).json({ message: "El token no existe" });
  }

  try {
    // confirm user
    user.confirmed = true;
    user.token = "";
    await user.save();
    res.json({ message: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res) => {
  // check if user exists
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "El usuario no existe" });
  }

  try {
    user.token = generateId();
    await user.save();
    // send email to user
    forgotPasswordEmail({
      email: user.email,
      name: user.name,
      token: user.token,
    });
    res.json({
      message: "Por favor revisa tu email para cambiar tu contraseña",
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.params;

  // check if token exists
  const user = await User.findOne({ token });
  if (user) {
    return res.json({ message: "Token verificado correctamente" });
  } else {
    return res.status(404).json({ message: "Token invalido" });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // check if user exists
  const user = await User.findOne({ token });
  if (user) {
    try {
      user.password = password;
      user.token = "";
      await user.save();
      res.json({ message: "Contraseña cambiada correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(404).json({ message: "Usuario invalido" });
  }
};

const profile = async (req, res) => {
  const { user } = req;
  res.json(user);
};

export {
  register,
  authenticate,
  confirmEmail,
  forgotPassword,
  verifyToken,
  newPassword,
  profile,
};
