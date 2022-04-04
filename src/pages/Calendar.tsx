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

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { CustomModal } from '../components/Modal';
import AlertBox from '../components/AlertBox';

interface eventInformation{
  author: string;
  confirmed_dod: [];
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




const EventPage = function (this: any): JSX.Element {
  const [eventInfo, seteventInfo] = useState<eventInformation>({
    author: '',
    confirmed_dod: [],
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
  const [displayEvent, setdisplayEvent] = useState<EventInput[]>([{

    title: '',
    start:'',
    end:''
  }]);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('success');
  const [viewModal, setViewModal] = useState(false);

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
          confirmed_dod: (data as any).confirmed_dod,
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

        let displayEvent:EventInput[]= []; 
        (data as any).forEach((element: any) => {
          displayEvent = displayEvent.concat({
            title: (element as any).title,
            start: (element as any).starttime,
            end: (element as any).endtime
          });
        });
        setdisplayEvent(displayEvent);
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
    // const title = prompt('Please enter a new title for your event');
    // const test1 = () => (
    //   consol
    // );
    // setViewModal(true);
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleEventClick = (clickInfo: EventClickArg) => {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
    // deleteEvent(clickInfo.event.remove());
    
    return(
      console.log(clickInfo.event.title)
    );
  };

  function addEvent(description: string, endtime: string, organizer: string, starttime: string, title: string, invitees_dod:string[],period:boolean,type:string){
    createEvent(description, endtime, organizer, starttime, title, invitees_dod, period,type)
      .then((string) => {
        setAlertMessage(string as string);
        setAlertStatus('success');
        setAlert(true);
      })
      .catch((error) => {
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
      });
  }
  

  return (
    <header>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
      <link rel="stylesheet" href="Profile.css" />
      <div className='demo-app'>
        <div className='demo-app-main'>

        </div>
      </div>
      {AlertBox(alert, setAlert, alertMessage, alertStatus)}
      <div className='buttonBackground'>
        <Button onClick={() => {
          setViewModal(true);
        }}>
          Create New Event
        </Button>
      </div>
      
      { <CustomModal open={viewModal} setOpen={setViewModal}>
        <Typography sx={{ p: 2 }}>
          <form
            // ref={formRef}
            onSubmit={(e: React.SyntheticEvent) => {
              e.preventDefault();
              const target = e.target as typeof e.target & {
                title: { value: string };
                description: { value: string };
                invitees_dod: { value:  string};
                starttime: {value: string};
                endtime: {value: string};
                organizer: {value: string};
                period:{value:boolean};
                type:{value:string};
              };
              // const calendarApi = selectInfo.view.calendar;
              const title = target.title.value; // typechecks!
              const description = target.description.value; // typechecks!
              const invitees_dod = target.invitees_dod.value.split(', ');
              const starttime= target.starttime.value;
              const endtime= target.endtime.value;
              const organizer= target.organizer.value;
              // const period= target.period.value;
              const period= true;
              const type= target.type.value;
              addEvent(description, endtime, organizer, starttime, title, invitees_dod,period,type);
              // etc...
              // calendarApi.addEvent({
              //   id: createEventId(),
              //   title,
              //   description,
              //   invitees,
              //   start: starttime,
              //   end: endtime,
              // });
              console.log(title + description + typeof (invitees_dod));
            }}
          >
            <div>
              <label>
                Title:
                <input type="text" name="title" />
              </label>
            </div>
            <div>
              <label>
                Description:
                <input type="text" name="description" />
              </label>
            </div>
            <div>
              <label>
                Invitees DOD:
                <input type="text" name="invitees_dod" placeholder='DOD, DOD, DOD...'/>
              </label>
            </div>
            <div>
              <label>
                Start Time:
                <input type="datetime-local" name="starttime" placeholder="yy-MM-dd SSS HH:mm:ss" />
              </label>
            </div>
            <div>
              <label>
                End Time:
                <input type="datetime-local" name="endtime" placeholder="yy-MM-dd SSS HH:mm:ss" />
              </label>
            </div>
            <div>
              <label>
                Organizer:
                <input type="text" name="organizer" />
              </label>
            </div>
            <div>
              <label>
                Period:
                <input type="radio" name="period" value="true" />
              </label>
            </div>
            <div>
              <label>
                Type:
                <input type="text" name="type"/>
              </label>
            </div>
            <div>
              <input type="submit" value="Submit" />
            </div>
          </form>
        </Typography>
      </CustomModal>}

      <div className="demo-app background_dark">
        <div className='demo-app-main'>
          {/* {console.log(eventArray[0])}
          {console.log(eventArray[1])} */}
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
          {/* {console.log(displayEvent)} */}

          {<FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            events={displayEvent}
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