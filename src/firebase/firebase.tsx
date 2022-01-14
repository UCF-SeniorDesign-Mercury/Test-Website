import * as firebase from 'firebase/app';
// import firebase from 'firebase/app'
import { Auth, getAuth, signInWithEmailAndPassword} from 'firebase/auth';
'@firebase/auth-types';

import { initializeApp } from 'firebase/app';
import { getStorage, ref,getBlob, listAll,getMetadata, getBytes, FirebaseStorage } from 'firebase/storage';

import firebaseConfig from './firebaseConfig';

// const axios = require('axios');

// Initialize Firebase App

if (!firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig);
}

export const loginWithEmail = async (email: string, password: string): Promise<boolean | undefined> =>
{
  try
  {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (err) {
    return false;
  }
};

///////////////////////////////////////////////////////////////////////////////////
export const getToken = async(auth: Auth): Promise<string | undefined> => {
  try
  {
    if (auth && auth.currentUser)
    {
      const token = await auth.currentUser.getIdToken(true);
      return token;
    }
  } catch (err) {
    throw (err);
  }
};

// export const auth = getAuth();
// export const registerWithEmail = async (email: string, password: string): Promise<boolean | undefined> =>
//   auth.createUserWithEmailAndPassword(email, password);



const firebaseApp = initializeApp(firebaseConfig);

export const downloadPDF = async (filename: string): Promise<string> =>{
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage, filename);
  const PDF = await (await getBlob(storageRef)).text();
  const PDF2 = 'data:application/pdf;base64,';
  const PDF3 = PDF2.concat(PDF);

  // console.log(PDF);
  return PDF3;
};


// listAll(storageRef)
//   .then((res) => {
//     res.prefixes.forEach((folderRef) => {
//       // All the prefixes under listRef.
//       // You may call listAll() recursively on them.
//       console.log(folderRef);
//     });
//     res.items.forEach((itemRef) => {
//       // All the items under listRef.
//       console.log(itemRef);
//     });
//   }).catch((error) => {
//     // Uh-oh, an error occurred!
//   });