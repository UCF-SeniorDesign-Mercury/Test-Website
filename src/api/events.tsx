import internal from 'stream';
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

//create event
export const createEvent = async (description: string, endtime: Date, organizer: string, starttime: Date, title: string): Promise<string | Date> => {
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

//get event
export const getEvent = async (event_id: string): Promise<string> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/events/get_event/' + event_id, {
      method: 'GET',
      mode: 'cors',
      headers: header,
      body: JSON.stringify(event_id),
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


//update event
export const updateEvent = async (description: string, endtime: Date, organizer: string, starttime: Date, title: string): Promise<string> => {
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

//get recent event
export const getRecentEvent = async (recent_event: unknown): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/events/get_recent_events/' + recent_event, {
      method: 'GET',
      mode: 'cors',
      headers: header,
      body: JSON.stringify(recent_event),
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

//get next event
export const getNextEvent = async (next_event: unknown): Promise<unknown> => {
  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/events/get_next_event_page/' + next_event, {
      method: 'GET',
      mode: 'cors',
      headers: header,
      body: JSON.stringify(next_event),
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

//register event

export const registerEvent = async (eventID: string): Promise<string> => {
  // const data = {
  //   description: description,
  //   endtime: endtime,
  //   organizer: organizer,
  //   starttime: starttime,
  //   title: title,
  // };
  console.log(JSON.stringify(eventID));

  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/files/update_file', {
      method: 'PUT',
      mode: 'cors',
      headers: header,
      body: JSON.stringify(eventID)
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


//cancel event
export const cancelEvent = async (eventID: string): Promise<unknown> => {

  console.log(JSON.stringify(eventID));

  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/files/update_file', {
      method: 'PUT',
      mode: 'cors',
      headers: header,
      body: JSON.stringify(eventID)
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

//change status

export const changeEventStatus = async (decision: string, event_id: string ): Promise<unknown> => {
  const data = {
    decision: decision,
    event_id: event_id,
  };

  console.log(JSON.stringify(data));

  const header = await getHeaders();

  return new Promise(function (resolve, reject) {
    fetch(url + '/files/update_file', {
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