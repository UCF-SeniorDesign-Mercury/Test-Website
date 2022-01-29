import { AxiosRequestHeaders } from 'axios';
import { getToken } from '../firebase/firebase';

export const url = 'https://mercury456.herokuapp.com';
export const headers: AxiosRequestHeaders = {
  'Content-Type': 'application/json',
  'Authorization': getToken() as unknown as string,
};