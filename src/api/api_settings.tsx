import { getToken } from '../firebase/firebase';

export const url = 'https://mercury456.herokuapp.com';

export const getHeaders = async (): Promise<HeadersInit> => {
  const token = await getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': token as unknown as string,
  };

  return headers;
};