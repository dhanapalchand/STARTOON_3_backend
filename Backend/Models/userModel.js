const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  gender: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.signup = async function (name, email, password, gender) {
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw Error("User Already Exists");
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hashedPassword,
    gender,
    count: 1,
    lastLogin: Date.now(),
  });

  return user;
};


userSchema.statics.login = async function (email, password) {
  const existingUser = await this.findOne({ email });

  if (!existingUser) {
    throw Error("User does not exist");
  }

  const match = await bcrypt.compare(password, existingUser.password);

  if (match) {
    return existingUser;
  } else {
    throw Error("Check Password and Try Again");
  }
};


userSchema.statics.updateUserOnLogin = async function (email) {
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("User does not exist");
  }

  user.count += 1;
  user.lastLogin = Date.now();

  await user.save();
  return user;
};

module.exports = mongoose.model("User", userSchema);
