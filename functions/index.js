const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(); // Initialize Firebase Admin SDK
const db = admin.firestore();
const auth = admin.auth();
//sign up function
exports.signUp = functions.https.onCall(async (data, context) => {
  const { email, password, name } = data;

  if (!email || !password || !name) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Email, password, and name are required"
    );
  }

  try {
    // 1️⃣ Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      username: name
    });

    // 2️⃣ Create Firestore user document
    await db.collection("users").doc(userRecord.uid).set({
      username,
      email,
      stars: 0,
      badge: [],
      hobbies: [],
	  createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { message: "User created successfully", uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

exports.getUserData = functions.https.onCall(async (data, context) => {
  // Must be authenticated
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to call this function"
    );
  }

  // Get Firestore user document
  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new functions.https.HttpsError("not-found", "User does not exist");
  }

  return userSnap.data(); // contains stars, badges, name, etc.
});
