import { url, getHeaders } from './api_settings';


// -id (String, immutable)
// -title (String, Admin mutable only)
// -description (String, Admin mutable only)
// -startdate (Timestamp, Admin mutable only)
// -enddate (Timestamp, Admin mutable only)
// -author (String, immutable)
// -participators (List<String>, mutable)
// -organizer (String, mutable)
// -status (String, server mutable only)
// -timestamp(Timestamp, server mutable only)

/*****************Events API CAlls*****************/
//Confirm  event
export const confirmEvent = async (event_id: string): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/events/confirm_event/' + event_id, {
      method: 'POST',
      mode: 'cors',
      headers: header
    })
      .then(async response => {
        console.log(response);
        if (response.status == 201) {
          resolve('Event Confirmed');
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

//create event
export const createEvent = async (description: string, endtime: string, organizer: string, starttime: string, title: string, invitees_dod:string[], period:boolean, type:string): Promise<string> => {
  const data = {
    description: description,
    endtime: endtime,
    organizer: organizer,
    starttime: starttime,
    title: title,
    invitees_dod: invitees_dod,
    period:period,
    type:type

  };
  console.log(JSON.stringify(data));

  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/events/create_event', {
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


//delete event
export const deleteEvent = async (eventID: string): Promise<string> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/events/delete_event/' + eventID, {
      method: 'DELETE',
      mode: 'cors',
      headers: header,
    })
      .then(async response => {
        console.log(response);
        if (response.status == 200) {
          resolve('File Deleted Successfully');
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
//update event
export const updateEvent = async (description: string, endtime: Date, organizer: string, starttime: Date, title: string, type:string): Promise<string> => {
  const data = {
    description: description,
    endtime: endtime,
    organizer: organizer,
    starttime: starttime,
    title: title,
  };
  console.log(JSON.stringify(data));

  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/events/update_event/', {
      method: 'PUT',
      mode: 'cors',
      headers: header,
      body: JSON.stringify(data)
    })
      .then(async response => {
        console.log(response);
        if (response.status == 200) {
          resolve('File Updated Successfully');
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

//get 10 recent events 
export const getEvents = async (): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/events/get_events', {
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

export const getEvent = async (eventID: string): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/events/get_event/' + eventID, {
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