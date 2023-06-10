import * as admin from "firebase-admin";

admin.initializeApp();
export { default as auth } from "./auth";
