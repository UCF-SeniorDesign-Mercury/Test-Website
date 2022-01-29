import { url, getHeaders } from './api_settings';

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

/*export const postFile = async (data: postData) => {
  const url_endpoint = url + '/files/upload_file';

  await axios
    .post(url_endpoint, data, { headers: headers})
    .then((response: any) => response.data)
    .catch((error: any) => console.error(error.message));
};*/

export const getFile = async (fileID: string): Promise<string> => {
  const header = await getHeaders();

  return new Promise(function(resolve,reject){
    fetch(url + '/files/get_file/' + fileID, {
      method: 'GET',
      mode: 'cors',
      headers: header,
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        resolve(data.file);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const postFile = async (file: string, filename: string, reviewer: string) => {
  const data = {
    file: file,
    filename: filename,
    reviewer: reviewer,

  };
  const header = await getHeaders();

  fetch(url + '/files/upload_file', {
    method: 'POST',
    mode: 'cors',
    headers: header,
    body: JSON.stringify(data)
  })
    .then(response => response)
    .then(data => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
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