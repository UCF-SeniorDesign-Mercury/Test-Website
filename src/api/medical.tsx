import { url, getHeaders } from './api_settings';

export const deleteMedicalRecords = async (dods: string): Promise<string> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/medical/delete_medical_records', {
      method: 'DELETE',
      mode: 'cors',
      headers: header,
    })
      .then(async response => {
        console.log(response);
        if (response.status == 200) {
          resolve('Medical Record Deleted Successfully');
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

export const getMedicalData = async (): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/medical/get_medical_data', {
      method: 'GET',
      mode: 'cors',
      headers: header,
      // body: JSON.stringify(),
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
            reject('Status 404: Event not found.');
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

export const getMedicalRecords = async (): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/medical/get_medical_records', {
      method: 'GET',
      mode: 'cors',
      headers: header,
      // body: JSON.stringify(),
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
            reject('Status 404: Event not found.');
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

export const uploadMedicalData = async (csv_file: string, filename: string): Promise<string> => {
  const data = {
    csv_file:csv_file,
    filename:filename

  };
  console.log(JSON.stringify(data));

  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/medical/upload_medical_data', {
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