const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const jwt = require('jsonwebtoken');
const { pick } = require('lodash');
const { generatePhrase } = require('../utils/phrase');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: '{VALUE} is not a valid email.',
    },
  },
  loginPhrase: {
    type: String,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  return pick(userObj, ['_id', 'email']);
};

UserSchema.methods.setLoginPhrase = function () {
  const user = this;
  const loginPhrase = generatePhrase();
  user.loginPhrase = loginPhrase;
  return new Promise((res, rej) => {
    user
      .save()
      .then(() => res(loginPhrase))
      .catch(err => rej(Error(err.message)));
  });
};

UserSchema.methods.generateAuthToken = function (loginPhrase) {
  const user = this;

  if (loginPhrase === user.loginPhrase) {
    const access = 'auth';
    const token = jwt
      .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
      .toString();
    user.tokens.push({ access, token });
    user.loginPhrase = null;
    return user.save().then(() => token);
  }

  return Promise.reject(Error('Could not authenticate phrase.'));
};

UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

UserSchema.methods.removeToken = function (token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: { token },
    },
  });
};

const User = mongoose.model('user', UserSchema);

module.exports = { User };
