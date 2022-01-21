// import firebase from 'firebase/app'
import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail} from 'firebase/auth';
'@firebase/auth-types';

import { initializeApp } from 'firebase/app';

// import { getStorage, ref,getBlob, listAll,getMetadata, getBytes, FirebaseStorage } from 'firebase/storage';
import { getStorage, ref,getBlob,} from 'firebase/storage';

import firebaseConfig from './firebaseConfig';
// import { Email, Password } from '@mui/icons-material';

// const axios = require('axios');

// Initialize Firebase App

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();

export const registerWithEmail = async (email: string, password: string): Promise<boolean | undefined> =>
{
  try
  {
    await createUserWithEmailAndPassword(auth, email, password);
    return true;
  } catch (err) {
    return false;
  }
};

export const verifyEmail = async (): Promise<void> => {
  try
  {
    if (auth.currentUser)
    {
      await sendEmailVerification(auth.currentUser);
    }
  } catch (err) {
  }
};

export const changePassword = async (email: string): Promise< boolean | void> =>{
  try
  {
    if (auth.currentUser)
    {
      await sendPasswordResetEmail(auth, email);
      return true;
    }
  } catch (err) {
    return false;
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<boolean | undefined> =>
{
  try
  {
    if(auth.currentUser?.emailVerified == true){
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    }
    
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