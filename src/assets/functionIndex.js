const functions = require("firebase-functions");
const mkdirp = require("mkdirp");
const admin = require("firebase-admin");
admin.initializeApp();
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");
const csv = require("csvtojson");


// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = "thumb_";
let permissionError = "You do not have the permission to perform this action";

exports.createUser = functions.https.onCall(async (data, context) => {
  try {
    if (context.auth) {
      let user = await admin.auth().createUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      });

      await admin.firestore().collection("users").doc(user.toJSON().uid).set({
        email: data.email,
        displayName: data.displayName,
        role: data.role,
      });

      if (data.role !== "normal") {
        let claims = {};
        claims[data.role] = true;
        await admin.auth().setCustomUserClaims(user.toJSON().uid, claims);
      }

      return user.toJSON();
    } else {
      console.log(permissionError);
      throw new functions.https.HttpsError(permissionError);
    }
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError(error);
  }
});

exports.createItems = functions.https.onCall(async (data, context) => {
  try {
    if (context.auth) {
      let numberOfItems = 0;

      data.items.forEach(async (item) => {
        numberOfItems++;
        await admin.firestore().collection(item.collection).add(item.item);
      });

      return numberOfItems;
    } else {
      console.log(permissionError);
      throw new functions.https.HttpsError(permissionError);
    }
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError(error);
  }
});

exports.fillDatabase = functions.https.onCall(async (data, context) => {
  try {
    if (context.auth) {
      let numberOfItems = 0;

      data.items.forEach(async (item) => {
        numberOfItems++;
        await admin.firestore().collection(item.collection).add(item.item);
      });

      return numberOfItems;
    } else {
      console.log(permissionError);
      throw new functions.https.HttpsError(permissionError);
    }
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError(error);
  }
});

exports.uploadPicture = functions.https.onCall(async (data, context) => {
  try {
    if (context.auth) {
      if (data.collection === "users") {
        return await admin.auth().updateUser(data.id, {
          photoURL: data.downloadURL,
        });
      }
      return;
    } else {
      console.log(permissionError);
      throw new functions.https.HttpsError(permissionError);
    }
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError(error);
  }
});

exports.generateThumbnail = functions.storage
  .object()
  .onFinalize(async (object) => {
    // File and directory paths.
    const filePath = object.name;
    const contentType = object.contentType; // This is the image MIME type
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const thumbFilePath = path.normalize(
      path.join(fileDir, `${THUMB_PREFIX}${fileName}`)
    );
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith("image/")) {
      return console.log("This is not an image.");
    }

    // Exit if the image is already a thumbnail.
    if (fileName.startsWith(THUMB_PREFIX)) {
      return console.log("Already a Thumbnail.");
    }

    // Cloud Storage files.
    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(filePath);
    const thumbFile = bucket.file(thumbFilePath);
    const metadata = {
      contentType: contentType,
      // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
      // 'Cache-Control': 'public,max-age=3600',
    };

    // Create the temp directory where the storage file will be downloaded.
    await mkdirp(tempLocalDir);
    // Download file from bucket.
    await file.download({ destination: tempLocalFile });
    console.log("The file has been downloaded to", tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    await spawn(
      "convert",
      [
        tempLocalFile,
        "-thumbnail",
        `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
        tempLocalThumbFile,
      ],
      { capture: ["stdout", "stderr"] }
    );
    console.log("Thumbnail created at", tempLocalThumbFile);
    // Uploading the Thumbnail.
    await bucket.upload(tempLocalThumbFile, {
      destination: thumbFilePath,
      metadata: metadata,
    });
    console.log("Thumbnail uploaded to Storage at", thumbFilePath);
    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempLocalThumbFile);
    // Get the Signed URLs for the thumbnail and original image.
    const config = {
      action: "read",
      expires: "03-01-3000",
    };
    const results = await Promise.all([
      thumbFile.getSignedUrl(config),
      file.getSignedUrl(config),
    ]);
    console.log("Got Signed URLs.");
    const thumbResult = results[0];
    const originalResult = results[1];
    const thumbFileUrl = thumbResult[0];
    const fileUrl = originalResult[0];
    // Add the URLs to the Database

    await admin.firestore().collection(fileDir).doc(fileName).update({
      thumbImage: thumbFileUrl,
    });
    return console.log("Thumbnail URLs saved to firestore.");
  });

exports.fillDatabaseCSV = functions.storage
  .object()
  .onFinalize(async (object) => {
    try {
      // File and directory paths.
      const filePath = object.name;
      const contentType = object.contentType;
      const tempLocalFile = path.join(os.tmpdir(), filePath);
      const tempLocalDir = path.dirname(tempLocalFile);
      const fileBasename = path.basename(filePath);

      // Exit if this is triggered on a file that is not an image.
      if (contentType !== "text/csv") {
        return console.log("This is not a csv file");
      }

      // Cloud Storage files.
      const bucket = admin.storage().bucket(object.bucket);
      const file = bucket.file(filePath);

      // Create the temp directory where the storage file will be downloaded.
      await mkdirp(tempLocalDir);

      // Download file from bucket.
      await file.download({ destination: tempLocalFile });
      console.log("The csv file has been downloaded to", tempLocalFile);

      const jsonArray = await csv().fromFile(tempLocalFile);

      let firestorePromise = [];

      if (fileBasename === "users") {
        jsonArray.forEach(async (item) => {
          let user = await admin.auth().createUser({
            email: item.email,
            password: item.password,
            displayName: item.displayName,
          });

          firestorePromise.push(
            admin.firestore().collection("users").doc(user.toJSON().uid).set({
              email: item.email,
              displayName: item.displayName,
              role: item.role,
            })
          );

          if (item.role !== "normal") {
            let claims = {};
            claims[item.role] = true;
            firestorePromise.push(
              admin.auth().setCustomUserClaims(user.toJSON().uid, claims)
            );
          }
        });
      } else {
        jsonArray.forEach(async (item) => {
          firestorePromise.push(
            admin.firestore().collection(fileBasename).add(item)
          );
        });
      }

      await Promise.all(firestorePromise);
      //delete temp and file itself
      fs.unlinkSync(tempLocalFile);
      await file.delete();
      return null;
    } catch (error) {
      console.log(error);
    }
  });
