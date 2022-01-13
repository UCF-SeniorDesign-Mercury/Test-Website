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

// export const firebaseStorage = async(storage:string): Promise<boolean | undefined> =>
// {
//   storage = firebase.storage(firebaseApp);
//   const files = [ 'RST_Request_Form_Blank.pdf' ]; 
//   files.map( filename => {
//       storage
//         .ref( `/covers/${filename}` )
//         .getDownloadURL()
//         .then( url => {
//           console.log( "Got download url: ", url );
//         });
//   });
// };

const firebaseApp = initializeApp(firebaseConfig);

export const downloadPDF = async (storage: FirebaseStorage, filename: string): Promise<ArrayBuffer> =>{
  storage = getStorage(firebaseApp);
  const storageRef = ref(storage, filename);
  const PDF = getBytes(storageRef);
  console.log(PDF);
  return PDF;
};
// Get a reference to the storage service, which is used to create references in your storage bucket
// const storage = getStorage(firebaseApp);
// const storageRef = ref(storage);
// const storageRef_RST_Base64 = ref(storage, 'RST_base64.txt');
// console.log(storageRef);
// console.log(storageRef_RST_Base64.storage);
// const test = storageRef_RST_Base64.toString();
// console.log(test);

// Get metadata properties
// getMetadata(storageRef_RST_Base64)
//   .then((metadata) => {
//     // Metadata now contains the metadata for 'images/forest.jpg'
//     console.log(metadata);
//     return metadata;
//   })
//   .catch((error) => {
//     // Uh-oh, an error occurred!
//   });

  

// getDownloadURL(ref(storage, 'RST_base64.txt'))
//   .then((url) => {
//     // `url` is the download URL for 'images/stars.jpg'

//     // This can be downloaded directly:
//     const xhr = new XMLHttpRequest();
//     xhr.responseType = 'blob';
//     xhr.onload = (event) => {
//       const blob = xhr.response;
//       console.log(blob);
//     };
//     xhr.open('GET', url);
//     xhr.send();

//     // Or inserted into an <img> element
//     const img = document.getElementById('myimg');
//     img.setAttribute('src', url);
//     console.log(url);
//   })
//   .catch((error) => {
//     // Handle any errors
//   });





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