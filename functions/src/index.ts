import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();
import { signinWithGoogle as signinWithGoogleFunc } from "./auth";


export const signinWithGoogle = onRequest(signinWithGoogleFunc);
