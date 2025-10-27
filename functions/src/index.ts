import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();

export const addUserToFirestore = onCall(async (request) => {
  const {uid, email, name, companyName, phone, plan} = request.data;

  if (!uid || !email || !name || !companyName || !phone || !plan) {
    logger.error("Missing data in request", {data: request.data});
    throw new Error("Missing data for user creation.");
  }

  try {
    const db = getFirestore();
    const companyRef = db.collection("companies").doc();
    const userRef = db.collection("users").doc(uid);

    const batch = db.batch();

    // Create company
    batch.set(companyRef, {
      name: companyName,
      plan: plan,
      ownerId: uid,
      createdAt: new Date(),
    });

    // Create user profile
    batch.set(userRef, {
      name: name,
      email: email,
      phone: phone,
      companyId: companyRef.id,
      role: "Admin", // Default role
      createdAt: new Date(),
    });

    await batch.commit();

    logger.info(`Successfully created company ${companyRef.id} and user ${uid}`);
    return {
      status: "success",
      companyId: companyRef.id,
      userId: uid,
    };
  } catch (error) {
    logger.error("Error creating user and company:", error);
    throw new Error("Failed to set up user and company in Firestore.");
  }
});
