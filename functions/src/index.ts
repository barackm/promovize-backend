import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
export { userCreated } from './auth';

const smtpConfig = functions.config().smtp;

console.log(smtpConfig, 'smtpConfig++++');
