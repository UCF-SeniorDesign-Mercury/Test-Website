import { url, getHeaders } from './api_settings';

export const getFile = async (fileID: string): Promise<string> => {
  const header = await getHeaders();

  return new Promise(function(resolve,reject){
    fetch(url + '/files/get_file/' + fileID, {
      method: 'GET',
      mode: 'cors',
      headers: header,
    })
      .then(async response => {
        console.log(response);
        if (response.status == 200) {          
          const data = await response.json();
          //console.log(data);
          resolve(data.file);
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

export const getUserFiles = async (): Promise<unknown> => {
  const header = await getHeaders();
  console.log(header);
  return new Promise(function(resolve,reject){
    fetch(url + '/files/get_user_files', {
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

export const postFile = async (file: string, filename: string, reviewer: string): Promise<void> => {
  const data = {
    file: file,
    filename: filename,
    reviewer: reviewer,
  };
  console.log(JSON.stringify(data));

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

export const updateFile = async (file: string, file_id: string, filename:string): Promise<void> => {
  const data = {
    file: file,
    file_id: file_id,
    filename: filename,
  };
  console.log(JSON.stringify(data));

  const header = await getHeaders();

  fetch(url + '/files/update_file', {
    method: 'PUT',
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

export const deleteFile = async (fileID: string): Promise<void> => {
  const header = await getHeaders();

  return new Promise(function(){
    fetch(url + '/files/delete_file/' + fileID, {
      method: 'DELETE',
      mode: 'cors',
      headers: header,
    })
      .then(response => response)
      .then(data => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

