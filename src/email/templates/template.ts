// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-var-requires
const fs = require('fs');

const emailVerificationTemplate = {
  Template: {
    TemplateName: 'email-verification',
    SubjectPart: 'Verify your email',
    HtmlPart: fs.readFileSync(__dirname + '/email-verification.hbs', 'utf8'),
  },
};
const templatesJSON = JSON.stringify(emailVerificationTemplate, null, 2);

const resetPasswordTemplate = {
  Template: {
    TemplateName: 'reset-password',
    SubjectPart: 'Reset your password',
    HtmlPart: fs.readFileSync(__dirname + '/reset-password.hbs', 'utf8'),
  },
};

const resetPasswordJSON = JSON.stringify(resetPasswordTemplate, null, 2);

fs.writeFileSync(__dirname + '/template.json', resetPasswordJSON);
module.exports = emailVerificationTemplate;
