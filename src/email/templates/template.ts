// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-var-requires
const fs = require('fs');

const emailVerificationTemplate = {
  Template: {
    TemplateName: 'email-verification',
    SubjectPart: 'Verify your email',
    HtmlPart: fs.readFileSync(__dirname + '/email-verification.hbs', 'utf8'),
  },
};

const resetPasswordTemplate = {
  Template: {
    TemplateName: 'reset-password',
    SubjectPart: 'Reset your password',
    HtmlPart: fs.readFileSync(__dirname + '/reset-password.hbs', 'utf8'),
  },
};

const passwordCreationRequestTemplate = {
  Template: {
    TemplateName: 'google-password-creation',
    SubjectPart: 'Create your password',
    HtmlPart: fs.readFileSync(
      __dirname + '/google-password-creation.hbs',
      'utf8',
    ),
  },
};

const templatesJSON = JSON.stringify(emailVerificationTemplate, null, 2);

const resetPasswordJSON = JSON.stringify(resetPasswordTemplate, null, 2);

const passwordCreationJSON = JSON.stringify(
  passwordCreationRequestTemplate,
  null,
  2,
);

fs.writeFileSync(__dirname + '/template.json', passwordCreationJSON);
module.exports = emailVerificationTemplate;
