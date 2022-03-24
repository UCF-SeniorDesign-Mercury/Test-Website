import { confirmEvent,createEvent, getEvents, deleteEvent,updateEvent,} from '../api/events';
import React, { useEffect, useState } from 'react';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {createEventId } from './event-utils';
import { EventInput } from '@fullcalendar/react';
import { auth } from '../firebase/firebase';
import { stat } from 'fs';
import { start } from 'repl';
import { Description } from '@mui/icons-material';

interface eventInformation{
  author: string;
  description: string;
  endtime: string;
  event_id: string;
  organizer: string;
  period: boolean;
  starttime: string;
  timeStamp: string;
  title: string;
  type: string;
}
const testEvent2:EventInput[] = [
    
  {
    author: 'test',
    title: 'hello',
    start:'2022-03-12',
    end: '2022-03-12' 
  }
  // {
  //   id: createEventId(),
  //   title: 'Timed event',
  //   start: '2022-03-12'
  // },
  // {
  //   id: createEventId(),
  //   title: 'test',
  //   start:'2022-03-12'

  // }
];




const EventPage = function (this: any): JSX.Element {
  const [eventInfo, seteventInfo] = useState<eventInformation>({
    author: '',
    description: '',
    endtime: '',
    event_id: '',
    organizer: '',
    period: true,
    starttime: '',
    timeStamp: '',
    title: '',
    type: '',
  });
  const [eventArray, seteventArray] = useState<eventInformation[]>([]);
  const [testEvent, settestEvent] = useState<EventInput[]>([{

    title: '',
    start:'',
    end:''
  }]);
  //  const testEvent:EventInput[] = [
    
  // {
  //   author: element.author,
  //   title: element.title,
  //   start: element.starttime,
  //   end: element.endtime,
  //   id: element.event_id,
  //   description: element.description
  // }
  // {
  //   id: createEventId(),
  //   title: 'Timed event',
  //   start: '2022-03-12'
  // },
  // {
  //   id: createEventId(),
  //   title: 'test',
  //   start:'2022-03-12'

  // }
  // ];


  function get_events(){
    getEvents()
      .then((data) => {
        seteventArray(data as eventInformation[]);
        // settestEvent(data as EventInput[]);
        // console.log(data);
        // const userName = (data as any).display_name;
        // console.log('name: ' + userName);
        const eventData: eventInformation = {
          author: (data as any).author,
          description: (data as any).description,
          endtime: (data as any).endtime,
          event_id: (data as any).event_id,
          organizer: (data as any).organizer,
          period: true,
          starttime: (data as any).starttime,
          timeStamp: (data as any).timestamp,
          title: (data as any).title,
          type: (data as any).type,
        };

        let testEvent4:EventInput[]= []; 
        (data as any).forEach((element: any) => {
          testEvent4 = testEvent4.concat({
            title: (element as any).title,
            start: (element as any).starttime,
            end: (element as any).endtime
          });
        });
        const testEvent3: EventInput[] = [{
          title: (data as any).title,
          start: (data as any).starttime,
          end: (data as any).endtime
        },
        {
          author: 'test',
          title: 'hello',
          start:'2022-03-12',
          end: '2022-03-12' 
        },
        {
          author: 'test',
          title: 'hello2',
          start:'2022-03-12',
          end: '2022-03-12' 
        }
        ];
        settestEvent(testEvent4);
        seteventInfo(eventData);
      })
      // .then(() =>{
      //   console.log(eventArray[0] + 'test');
      //   console.log('test pt 2 :)'); 
      // }) 
      .catch((error) => {
        console.log('didnt work! :)');
      });
  }

  useEffect(()=>{
    get_events();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  function renderEventContent(eventContent: EventContentArg) {
    return (
      <>
        <b>{eventContent.timeText}</b>&nbsp;
        <i>{eventContent.event.title}</i>&nbsp;
        {/* <i>{eventContent.event.extendedProps.description}</i> */}
      </>
    );
  }
  function renderSidebarEvent(event: EventApi) {
    return (
      <li key={event.id}>
        <b>{formatDate(event.start!, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
        <i>{event.title}</i>
      </li>
    );
  }
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  };
  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  };

  

  return (
    <header>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
      <link rel="stylesheet" href="Profile.css" />
      <div className='demo-app'>
        <div className='demo-app-main'>

        </div>
      </div>
      <div className="demo-app">
        <div className='demo-app-main'>
          {console.log(eventArray[0])}
          {console.log(eventArray[1])}
          { eventArray.map((element) => Object.keys(element).map((key) =>{
            // if((key as string) == 'starttime'){
            //   return(
            //     <h2 className='username-display' key={key}>id: {(element as { [key: string]: any })[key]}</h2>  
            //   );
            // }
            // return(<h2 key={key}>{(element as { [key: string]: any })[key]}</h2>);
            
            
          }
          ))        
          }
          {console.log(testEvent)}

          {<FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            events={testEvent}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateSelect}  
            eventContent={renderEventContent}
            eventClick={handleEventClick}
          />}
        </div>
      </div>
    </header>
  );
};

export default EventPage;