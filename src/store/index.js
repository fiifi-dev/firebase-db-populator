import { auth, db, functions, storage } from "../plugins/db";
import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
Vue.use(Vuex);

let unauthorizedMessage = "Unauthorized action";
// let errorMessage = "An Error Occured: Try again";

export default new Vuex.Store({
  state: {},
  mutations: vuexfireMutations,
  actions: {
    signIn: firestoreAction(async (context, payload) => {
      try {
        await auth.signInWithEmailAndPassword(payload.email, payload.password);
      } catch (error) {
        throw Error(error);
      }
    }),
    signOut: firestoreAction(async () => {
      let user = auth.currentUser;
      if (user) {
        try {
          await auth.signOut();
        } catch (error) {
          throw Error(error);
        }
      } else {
        throw Error(unauthorizedMessage);
      }
    }),
    createUser: firestoreAction(async (context, payload) => {
      let user = auth.currentUser;
      if (user) {
        try {
          var createUser = functions.httpsCallable("createUser");
          let newUser = await createUser({
            email: payload.email,
            password: payload.password,
            displayName: payload.displayName,
            role: payload.role,
          });

          return newUser;
        } catch (error) {
          throw Error(error);
        }
      } else {
        throw Error(unauthorizedMessage);
      }
    }),
    createItem: firestoreAction(async (context, payload) => {
      let user = auth.currentUser;
      if (user) {
        try {
          if (payload.single == true) {
            return await db
              .collection(payload.collection)
              .doc(payload.collection)
              .set(payload.item);
          } else {
            return await db.collection(payload.collection).add(payload.item);
          }
        } catch (error) {
          throw Error(error);
        }
      } else {
        throw Error(unauthorizedMessage);
      }
    }),

    createItems: firestoreAction(async (context, payload) => {
      let user = auth.currentUser;
      if (user) {
        try {
          payload.items.forEach((item) => {
            item.items.forEach(async (innerItem) => {
              if (item.single == true) {
                return await db
                  .collection(item.collection)
                  .doc(item.collection)
                  .set(innerItem);
              } else {
                return await db.collection(item.collection).add(innerItem);
              }
            });
          });

          return null;
        } catch (error) {
          throw Error(error);
        }
      } else {
        throw Error(unauthorizedMessage);
      }
    }),

    uploadFile: firestoreAction(async (context, payload) => {
      let user = auth.currentUser;
      if (user) {
        try {
          let storageRef = storage.ref();

          let uploadTask = await storageRef
            .child(`${payload.collection}/${payload.id}`)
            .put(payload.file);

          let downloadURL = await uploadTask.ref.getDownloadURL();

          await db
            .collection(payload.collection)
            .doc(payload.id)
            .set({ image: downloadURL }, { merge: true });

          return downloadURL;
        } catch (error) {
          throw Error(error);
        }
      } else {
        throw Error(unauthorizedMessage);
      }
    }),

    uploadPicture: firestoreAction(async (context, payload) => {
      let user = auth.currentUser;
      if (user) {
        try {
          var uploadPicture = functions.httpsCallable("uploadPicture");

          await uploadPicture({
            id: payload.id,
            collection: payload.collection,
            downloadURL: payload.downloadURL,
          });

          return;
        } catch (error) {
          throw Error(error);
        }
      } else {
        throw Error(unauthorizedMessage);
      }
    }),

    //experiments
    async fillDatabaseCSV(context, payload) {
      let user = auth.currentUser;
      if (user) {
        try {
          let storageRef = storage.ref();
          await storageRef.child(`csv/${payload.collection}`).put(payload.file);

          return;
        } catch (error) {
          throw Error(error);
        }
      } else {
        throw Error(unauthorizedMessage);
      }
    },
  },
});
