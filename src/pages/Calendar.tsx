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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { CustomEventModal } from '../components/Modal';
import AlertBox from '../components/AlertBox';
import { getMedicalData } from '../api/medical';
import { getUsers } from '../api/users';
import { pushGraphicsState } from 'pdf-lib';
import { NavLink } from 'react-router-dom';

interface eventInformation{
  author: string;
  confirmed_dod: [];
  description: string;
  endtime: string;
  event_id: string;
  organizer: string;
  starttime: string;
  timeStamp: string;
  title: string;
  type: string;
}

interface usersInformation{
  name: string;
  dod: string;
}




const EventPage = function (this: any): JSX.Element {
  const [eventArray, seteventArray] = useState<eventInformation[]>([]);
  const [displayEvent, setdisplayEvent] = useState<EventInput[]>([{

    title: '',
    start: '',
    end:'',
    id:''
  }]);

  
  const [usersInfo, setUsersInfo] = useState<{name: string; dod: string}[]>([]);
  const[userSubmitInfo, setuserSubmitInfo] = useState<string[]>([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('success');
  const [viewModal, setViewModal] = useState(false);

  async function get_events(){

    let deezEvents:EventInput[]= []; 
    // let eventDetails:EventInput[] = [];

    await getEvents()
      .then((data) => {
        seteventArray(data as eventInformation[]);

        (data as any).forEach((element: any) => {
          deezEvents = deezEvents.concat({
            title: (element as any).title,
            start: (new Date((element as any).starttime as string)).toISOString(),
            end: (new Date((element as any).endtime as string)).toISOString(),
            id: (element as any).event_id
          });
        });
      }) 
      .catch((error) => {
        console.log('didnt work! :)');
      });

    await getMedicalData()
      .then((data) => {
        const numMonths=[9,12,15];
        
        numMonths.forEach(element => {
          const dentCopy = new Date(new Date((data as any).dent_date as string).getTime());
          dentCopy.setMonth(dentCopy.getMonth()+element);
          const phaCopy = new Date(new Date((data as any).pha_date as string).getTime());
          phaCopy.setMonth(phaCopy.getMonth()+element);
          deezEvents = deezEvents.concat({
            title: 'Dental > ' + element +' Months',
            start: (dentCopy).toISOString(),
            end: (dentCopy).toISOString(),
          });
          deezEvents = deezEvents.concat({
            title: 'PHA > ' + element +' Months',
            start: (phaCopy).toISOString(),
            end: (phaCopy).toISOString(),
          });
        });
      })
      .catch((error) => {
        console.log('didnt work! :)');
      });

    console.log(deezEvents);
    setdisplayEvent(deezEvents);
  }

  function get_users(){
    getUsers()
      .then((data) => {
        const usersData:{name: string; dod: string}[] = [];
        for (let i = 0; i < (data as unknown[]).length; i++){
          usersData.push({name: (data as any)[i].name as string, dod: (data as any)[i].dod as string});
        }
        setUsersInfo(usersData as any);
        
      }) 
      .catch((error) => {
        console.log('didnt work! :)');
      });
  }

  useEffect(()=>{
    get_users();
    console.log(usersInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    get_events();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    // console.log(displayEvent);
  },[displayEvent]);

  function renderEventContent(eventContent: EventContentArg) {
    return (
      <>
        <b>{eventContent.timeText}</b>&nbsp;
        <i>{eventContent.event.title}</i>&nbsp;
        {/* <i>{eventContent.event.extendedProps.description}</i> */}
      </>
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
  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      deleteEvent(clickInfo.event.id);
      clickInfo.event.remove();
    }
    
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
      <link rel="stylesheet" href="Calendar.css" />
      <div className='demo-app'>
        <div className='demo-app-main'>

        </div>
      </div>
      <NavLink to="/home">
        <Button type="submit">
          Go Back to Home
        </Button>
      </NavLink>
      {AlertBox(alert, setAlert, alertMessage, alertStatus)}
      <div className='buttonBackground'>
        <Button onClick={() => {
          setViewModal(true);
        }}>
          Create New Event
        </Button>
      </div>

      {/* { Object.keys(usersInfo).map((key) =>{
        if((key as string) == 'name'){
          return(
            <h2 className='center userdata-color' key={key}>Name: {(userInfo as { [key: string]: any })[key]}</h2>  
          );
        }
        else if((key as string) == 'dod'){
          return(
            <h2 className='center userdata-color' key={key}>DOD: {(userInfo as { [key: string]: any })[key]}</h2>  
          );
        }
      }
      )
      } */}
      
      { <CustomEventModal open={viewModal} setOpen={setViewModal}>
        <Typography sx={{ p: 2 }}>
          <form
            // ref={formRef}
            onSubmit={(e: React.SyntheticEvent) => {
              e.preventDefault();
              const target = e.target as typeof e.target & {
                title: { value: string };
                description: { value: string };
                invitees_dod: { value:  string};
                starttime: {value: Date};
                endtime: {value: Date};
                organizer: {value: string};
                period:{value:boolean};
                type:{value:string};
              };
              // const calendarApi = selectInfo.view.calendar;
              const title = target.title.value; // typechecks!
              const description = target.description.value; // typechecks!
              // const invitees_dod = target.invitees_dod.value.split(', ');
              const invitees_dod:string[] = [];
              console.log(userSubmitInfo);
              userSubmitInfo.forEach(element => {
                invitees_dod.push(element as string);
              });
              // const invitees_dod = userSubmitInfo.split(',');
              const starttime= new Date(target.starttime.value).toISOString();
              const endtime= new Date(target.endtime.value).toISOString(); 
              const organizer= target.organizer.value;
              // const period= getBoolean(target.period.value);
              const period = false;
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
              // const testTime = new Date(starttime);
              console.log(starttime);
            }}
          >
            <div>
              <label className='modalText'>
                Title: <br/>
                <input type="text" name="title" placeholder="Title" />
              </label>
            </div>
            <div>
              <label className='modalText'>
                Description: <br/>
                <input type="text" name="description" placeholder="Description" />
              </label>
            </div>
            {<div>
              <p><br/>Please select invitees:</p>
              <Select
                multiple={true}
                value={userSubmitInfo}
                onChange={(event) => {
                  console.log(event.target.value);
                  setuserSubmitInfo(event.target.value as any);
                }}
              >
                <MenuItem disabled key={'none'} value={'none'}>None</MenuItem>
                {
                  usersInfo.map(option => {
                    return (
                      <MenuItem key={option.dod} value={option.dod}>
                        {option.name}
                      </MenuItem>
                    );
                  })
                }
              </Select>
            </div>}
            <div>
              <label className='modalText'>
                Start Time: <br/>
                <input type="datetime-local" name="starttime" placeholder="yy-MM-dd SSS HH:mm:ss" />
              </label>
            </div>
            <div>
              <label className='modalText'> 
                End Time: <br/>
                <input type="datetime-local" name="endtime" placeholder="yy-MM-dd SSS HH:mm:ss" />
              </label>
            </div>
            <div>
              <label className='modalText'>
                Organizer: <br/>
                <input type="text" name="organizer" placeholder="Organizer" />
              </label>
            </div>
            <div>
              <label className='modalText'>
                Type:<br/>
                {/* <input type="text" name="type" placeholder="Type"/> */}
                {/* <p>Please Select the Event Type:</p> */}
                <input type="radio" id="type" value="mandatory" name="type"/>Mandatory  
                <input type="radio" id="type" value="optional" name="type"/>Optional 
                <input type="radio" id="type" value="personal" name="type"/>Personal 
              </label>
            </div>
            <div>
              <input type="submit" value="Submit" />
            </div>
          </form>
        </Typography>
      </CustomEventModal>}
      <div className="demo-app">
        <div className='demo-app-main'>
          {/* {console.log(eventArray[0])}
          {console.log(eventArray[1])} */}
          {/* {console.log(displayEvent)} */}

          {<FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            events={displayEvent}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            eventTextColor='black'
            eventBackgroundColor='#FFC947'
            eventColor = '#FFC947'
            initialView='dayGridMonth'
            eventBorderColor='#FFC947'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateSelect}  
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            //  you can update a remote database when these fire:
            // eventAdd={function(){}}
            // eventChange={function(){}}
            // eventRemove={function(){}}
            
          />}
        </div>
      </div>
    </header>
  //   {formType.formType == '1380_form' && <div>
  //   <p><br/>Please select the officer to sign off.</p>
  //   <Select
  //     value={reviewer}
  //     onChange={(event) => {
  //       setReviewer(event.target.value);
  //     }}
  //   >
  //     <MenuItem disabled key={'none'} value={'none'}>None</MenuItem>
  //     {
  //       reviewerList.map(option => {
  //         return (
  //           <MenuItem key={option.dod} value={option.dod}>
  //             {option.name}
  //           </MenuItem>
  //         );
  //       })
  //     }
  //   </Select>
  // </div>}
  );
};

export default EventPage;