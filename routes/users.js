const express = require('express');
const { pick } = require('lodash');
const { authenticate } = require('../middleware/authenticate');
const { User } = require('../models/user');
const { sendLoginPhrase } = require('../utils/email');

const router = express.Router();

router.post('/login', (req, res) => {
  const body = pick(req.body, ['email']);
  const user = new User(body);

  user
    .save()
    .then(() => user.setLoginPhrase().then((loginPhrase) => {
      sendLoginPhrase(body.email, loginPhrase)
        .then(() => {
          res.send();
        })
        .catch(err => res.status(400).send({ message: err.message }));
    }))
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

router.post('/verify', (req, res) => {
  const body = pick(req.body, ['email', 'loginPhrase']);

  User.findOne({ email: body.email })
    .then((user) => {
      user
        .generateAuthToken(body.loginPhrase)
        .then((token) => {
          res.header('x-auth', token).send(user);
        })
        .catch(err => res.status(400).send({ message: err.message }));
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.delete('/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send({ message: 'Successfully logged out.' });
    },
    () => res.status(400).send({ message: 'Could not log out.' }),
  );
});

module.exports = router;
