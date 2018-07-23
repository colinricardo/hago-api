const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY, NOREPLY_EMAIL, LOGIN_PHRASE_EMAIL_ID } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendLoginPhrase = (email, loginPhrase) => {
  const msg = {
    to: email,
    from: NOREPLY_EMAIL,
    templateId: LOGIN_PHRASE_EMAIL_ID,
    substitutions: {
      loginPhrase,
    },
  };

  return new Promise((res, rej) => {
    sgMail
      .send(msg)
      .then(() => {
        res('Email sent!');
      })
      .catch((err) => {
        console.error(err.headers.body);
        rej(new Error('Could not send email.'));
      });
  });
};

module.exports = { sendLoginPhrase };
