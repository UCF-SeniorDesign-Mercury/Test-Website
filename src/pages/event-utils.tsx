import { EventInput } from '@fullcalendar/react';
import { Description } from '@mui/icons-material';
import { confirmEvent,createEvent, getEvents, deleteEvent,updateEvent,} from '../api/events';
import React, { useEffect, useState } from 'react';

let eventGuid = 0;
const todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
export const createEventId = () => String(eventGuid++);

export const testEvent: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: 'test',
    start:'2022-03-12'

  }
];



function get_events(){
  getEvents().then((data) => {
    console.log(data);
  })
    .catch((error) => {
      console.log('didnt work! :)');
    });
}

// interface eventInformation{
//   author: string;
//   description: string;
//   endTime: string;
//   eventId: string;
//   organizer: string;
//   period: boolean;
//   startTime: string;
//   timeStamp: string;
//   title: string;
//   type: string;
// }


// const EventPage = function (): JSX.Element {
//   const [eventInfo, seteventInfo] = useState<eventInformation>({
//     author: '',
//     description: '',
//     endTime: '',
//     eventId: '',
//     organizer: '',
//     period: true,
//     startTime: '',
//     timeStamp: '',
//     title: '',
//     type: '',
//   });
//   const [eventArray, seteventArray] = useState<eventInformation[]>([]);

//   function get_events(){
//     getEvents()
//       .then((data) => {
//         seteventArray(data as eventInformation[]);
//         console.log(data);
//         // const userName = (data as any).display_name;
//         // console.log('name: ' + userName);
//         const eventData: eventInformation = {
//           author: (data as any).author,
//           description: (data as any).description,
//           endTime: (data as any).endtime,
//           eventId: (data as any).eventId,
//           organizer: (data as any).organizer,
//           period: true,
//           startTime: (data as any).startTime,
//           timeStamp: (data as any).timestamp,
//           title: (data as any).title,
//           type: (data as any).type,
//         };
//         seteventInfo(eventData);
//       })
//       // .then(() =>{
//       //   console.log(eventArray[0] + 'test');
//       //   console.log('test pt 2 :)'); 
//       // }) 
//       .catch((error) => {
//         console.log('didnt work! :)');
//       });
//   }

//   useEffect(()=>{
//     get_events();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   },[]);

//   return (
//     <header>
//       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
//       <link rel="stylesheet" href="Profile.css" />
//       <div className="profile-page">
        
//         {console.log(eventArray[0])}
//         {console.log(eventArray[1])}
        
//         { eventArray.map((element) => Object.keys(element).map((key) =>{
//           // if((key as string) == 'name'){
//           //   return(
//           //     <h2 className='username-display' key={key}>Name: {(userInfo as { [key: string]: any })[key]}</h2>  
//           //   );
//           // }
//           const author = element.author;
//           console.log(author);
          
//           return(<h2 key={key}>{(element as { [key: string]: any })[key]}</h2>);

//         }
//         ))
//         }
        
        
//       </div>
//     </header>
//   );
// };

// export default EventPage;