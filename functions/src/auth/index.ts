import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

type SignUpMethod = 'google' | 'email' | 'unknown';

const getSignUpMethod = (providerData: any): SignUpMethod => {
  if (providerData && providerData.length > 0) {
    const googleProvider = 'google.com';
    const emailProvider = 'password';

    for (let i = 0; i < providerData.length; i++) {
      const provider = providerData[i].providerId;
      if (provider.includes(googleProvider)) {
        return 'google';
      } else if (provider.includes(emailProvider)) {
        return 'email';
      }
    }
  }

  return 'unknown';
};

export const userCreated = functions.auth.user().onCreate(async (user) => {
  const { uid, displayName, email, photoURL, providerData } = user;

  const usersCollection = admin.firestore().collection('users');
  const userDoc = await usersCollection.doc(uid).get();

  if (userDoc.exists) {
    console.log('User already exists');
    return;
  }

  const signUpMethod = getSignUpMethod(providerData);
  const firstName = signUpMethod === 'google' ? displayName?.split(' ')[0] || '' : '';
  const lastName = signUpMethod === 'google' ? displayName?.split(' ')[1] || '' : '';

  const userData = {
    uid,
    firstName,
    lastName,
    email,
    photoURL,
    companyName: '',
    industryTags: [],
    notificationPreferences: {
      contentRecommendations: true,
      accountUpdates: true,
      analyticsReports: false,
    },
    contactInformation: {
      phone: '',
      address: '',
    },
    securitySettings: {
      twoFactorAuth: false,
      securityQuestions: false,
    },
    termsAgreement: true,
    emailUnsubscribe: false,
    emailVerified: signUpMethod === 'email' ? false : true,
    authMethod: signUpMethod,
  };

  await usersCollection.doc(uid).set(userData);
});
