import { url, getHeaders } from './api_settings';

export const getUser = async (): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function(resolve,reject){
    fetch(url + '/users/get_user', {
      method: 'GET',
      mode: 'cors',
      headers: header,
    })
      .then(async response => {
        console.log(response);
        if (response.status == 200) {          
          const data = await response.json();
          //console.log(data);
          resolve(data);
        }
        else {
          if (response.status == 400)
            reject('Status 400: Bad Request');
          else if (response.status == 401)
            reject('Status 401: Unauthorized - the provided token is not valid.');
          else if (response.status == 404)
            reject('Status 404: File not found.');
          else if (response.status == 415)
            reject('Status 415: Unsupported media type.');
          else if (response.status == 500)
            reject('Status 500: Internal API Error.');
          reject('Error. Please try again later.');
        }
      })
      .catch(err => console.log(err));
  });
};

export const updateUser = async (data: unknown): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function(resolve,reject){
    fetch(url + '/users/update_user', {
      method: 'PUT',
      mode: 'cors',
      headers: header,
      body: JSON.stringify(data),
    })
      .then(async response => {
        console.log(response);
        if (response.status == 200 || response.status == 201) {          
          resolve('User Data Updated Successfully');
        }
        else {
          if (response.status == 400)
            reject('Status 400: Bad Request');
          else if (response.status == 401)
            reject('Status 401: Unauthorized - the provided token is not valid.');
          else if (response.status == 404)
            reject('Status 404: File not found.');
          else if (response.status == 415)
            reject('Status 415: Unsupported media type.');
          else if (response.status == 500)
            reject('Status 500: Internal API Error.');
          reject('Error. Please try again later.');
        }
      })
      .catch(err => console.log(err));
  });
};