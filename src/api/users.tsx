import { url, getHeaders } from './api_settings';

//Update User
export const updateUser = async (branch: string,  description: string,  dod: string,  grade: string,  level: number | string,  name: string,  phone: string,  profile_picture: string,  rank: string,  superior: string): Promise<string | number> => {
  const data = {
    branch: branch,
    description: description,
    dod: dod,
    grade: grade,
    level: level,
    name: name,
    phone: phone,
    profile_picture: profile_picture,
    rank: rank,
    superior: superior
  };
  console.log(JSON.stringify(data));

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

//Register User
export const registerUser = async (branch: string,  description: string,  dod: string,  grade: string,  level: number | string,  name: string,  phone: string,  profile_picture: string,  rank: string,  superior: string): Promise<string | number> => {
  const data = {
    branch: branch,
    description: description,
    dod: dod,
    grade: grade,
    level: level,
    name: name,
    phone: phone,
    profile_picture: profile_picture,
    rank: rank,
    superior: superior
  };
  console.log(JSON.stringify(data));

  const header = await getHeaders();

  return new Promise(function(resolve,reject){
    fetch(url + '/users/register_user', {
      method: 'POST',
      mode: 'cors',
      headers: header,
      body: JSON.stringify(data)
    })
      .then(async response => {
        console.log(response);
        if (response.status == 201) {          
          resolve('File Uploaded Successfully');
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


//Get User
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
          // console.log(data);
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

//delete user

export const deleteUser = async (userID: string): Promise<string> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/users/delete_user/' + userID, {
      method: 'DELETE',
      mode: 'cors',
      headers: header,
    })
      .then(async response => {
        console.log(response);
        if (response.status == 200) {
          resolve('User Deleted Successfully');
        }
        else {
          if (response.status == 400)
            reject('Status 400: Bad Request');
          else if (response.status == 401)
            reject('Status 401: Unauthorized - the provided token is not valid.');
          else if (response.status == 404)
            reject('Status 404: User not found.');
          else if (response.status == 500)
            reject('Status 500: Internal API Error.');
          reject('Error. Please try again later.');
        }
      })
      .catch(err => console.log(err));
  });
};

export const getUsers = async (extraURLparameters = ''): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function(resolve,reject){
    fetch(url + '/users/get_users?' + extraURLparameters, {
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

export const getSubordinates = async (dod:string): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function(resolve,reject){
    fetch(url + '/users/get_subordinates', {
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