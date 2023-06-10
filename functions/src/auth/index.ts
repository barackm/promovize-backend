import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";


// listen for user signup (manual)
export const signinWithGoogle = onRequest(async (request, response) => {
    try {
        // const { uid, displayName, email, photoURL } = request.body;
        console.log("signinWithGoogle", request.body);
        logger.info("signinWithGoogle", { structuredData: true });
        response.send({ message: "Signup successful" });

    } catch (error) {

    }
});
