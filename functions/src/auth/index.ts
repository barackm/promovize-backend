import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { firestore } from 'firebase-admin';

export default {
  signinWithGoogle: onRequest(async (request: any, response: any) => {
    try {
      const { uid, displayName, email, photoURL } = request.body;

      const usersCollection = firestore().collection('users');
      const userDoc = await usersCollection.doc(uid).get();

      if (userDoc.exists) {
        response.send({ message: 'User already exists' });
        return response.status(200);
      }

      const userData = {
        uid,
        firstName: displayName.split(' ')[0],
        lastName: displayName.split(' ')[1],
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
        emailVerified: true, // Because we're using Google Sign-In,
        authMethod: 'email',
      };

      await usersCollection.doc(uid).set(userData);
      logger.info('New user document created', { structuredData: true });
      response.send({ message: 'User created successfully', data: userData });
    } catch (error) {
      logger.error('Error creating user:', error);
      response.status(500).send({ error: 'An error occurred while creating the user' });
    }
  }),

  signUpWithEmail: onRequest(async (request: any, response: any) => {
    try {
      const { uid, email } = request.body;

      const usersCollection = firestore().collection('users');
      const userDoc = await usersCollection.doc(uid).get();

      if (userDoc.exists) {
        response.send({ message: 'User already exists' });
        return response.status(200);
      }

      const userData = {
        uid,
        firstName: '',
        lastName: '',
        email,
        companyName: '',
        industryTags: '',
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
        emailVerified: false,
        authMethod: 'email',
      };

      await usersCollection.doc(uid).set(userData);
      logger.info('New user document created', { structuredData: true });
      response.send({ message: 'User created successfully', data: userData });
    } catch (error) {
      logger.error('Error creating user:', error);
      response.status(500).send({ error: 'An error occurred while creating the user' });
    }
  }),
};
