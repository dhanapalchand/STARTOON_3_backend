const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.SECRET_KEY, {
    expiresIn: "12h",
  });
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.login(email, password);

   
    await User.updateUserOnLogin(email);

    const token = createToken(user._id);
    res.status(200).json({ id: user._id, token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signup = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const gender = req.body.gender;
  try {
    const user = await User.signup(name, email, password, gender);

    const token = createToken(user._id);

    res.status(200).json({ id: user._id, token, user });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

module.exports = {
  signup,
  login,
};
