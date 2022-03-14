import { EventInput } from '@fullcalendar/react';
import { Description } from '@mui/icons-material';
import { confirmEvent,createEvent, getEvents, deleteEvent,updateEvent,} from '../api/events';

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