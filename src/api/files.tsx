import { url, getHeaders } from './api_settings';

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

export const postFile = async (file: string, filename: string, reviewer: string, signature: string) => {
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

export const updateFile = async (file: string, file_id: string, filename:string) => {
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

  return new Promise(function(resolve,reject){
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

