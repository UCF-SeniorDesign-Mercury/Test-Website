import * as firebase from 'firebase/app';
import { Auth, getAuth, signInWithEmailAndPassword} from 'firebase/auth';
'@firebase/auth-types';

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