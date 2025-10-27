import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

initializeApp();

export const addUserToFirestore = onCall(async (request) => {
  const { uid, email, name, companyName, phone, plan } = request.data;

  if (!uid || !email || !name || !companyName || !phone || !plan) {
    logger.error("Missing data in request", { data: request.data });
    throw new Error("Missing data for user creation.");
  }

  try {
    const db = getFirestore();
    const companyRef = db.collection("companies").doc();
    const userRef = db.collection("users").doc(uid);

    const batch = db.batch();

    const now = Timestamp.now();

    // Create company
    batch.set(companyRef, {
      name: companyName,
      plan,
      ownerId: uid,
      createdAt: now,
    });

    // Create user profile
    batch.set(userRef, {
      name,
      email,
      phone,
      companyId: companyRef.id,
      role: "Admin",
      createdAt: now,
    });

    await batch.commit();

    logger.info(`Successfully created company ${companyRef.id} and user ${uid}`);
    return {
      status: "success",
      companyId: companyRef.id,
      userId: uid,
    };
  } catch (error: any) {
    logger.error("Error creating user and company:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to set up user and company in Firestore: ${error.message}`);
  }
});
