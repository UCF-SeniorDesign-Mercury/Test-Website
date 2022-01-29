import axios, { AxiosRequestHeaders } from 'axios';
import { url, headers } from './api_settings';
import { getToken } from '../firebase/firebase';

interface postData {
  file: string | ArrayBuffer | null;
  filename: string;
  reviewer: string;
}

/*export const getFile = async (endpoint, token) => {
  const url_endpoint = url + endpoint;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token
    };

  return axios
    .get(url_endpoint, { headers: headers })
    .then((response) => response.data)
    .catch((error) => console.error(error.message));
};*/

export const postFile = async (data: postData) => {
  const url_endpoint = url + '/files/upload_file';

  await axios
    .post(url_endpoint, data, { headers: headers})
    .then((response: any) => response.data)
    .catch((error: any) => console.error(error.message));
};

/*export const putFile = async (data, endpoint) => {
  const token = await getToken();
  const url_endpoint = url + endpoint;

  return axios
    .put(url_endpoint, data, { headers: headers })
    .then((response) => response.data)
    .catch((error) => console.error(error.message));
};

export const deleteFile = async (data, endpoint) => {
  const token = await getToken();
  const url_endpoint = url + endpoint;

  return axios
    .delete(url_endpoint, data, { headers: headers })
    .then((response) => response.data)
    .catch((error) => console.error(error.message));
};*/