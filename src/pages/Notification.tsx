import {  } from '../components/PDF_Components/PDFview';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { confirmEvent } from '../api/events';
import { Box } from '@mui/system';
import { deleteNotifications, getNotifications } from '../api/notifications';
import { NavLink } from 'react-router-dom';

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const Notification = function (): JSX.Element {
  const [notifications,setNotifications] = useState([{
    id: '',
    notification_id: '',
    notification_type: '',
    read: true,
    receiver: '',
    sender: '',
    tpye: '', 
    timestamp: '',
  },]);

  const [eventId, setEventId] = useState('');

  const columns: GridColDef[] = [
    {
      field: 'notification_type',
      headerName: 'Title',
      type: 'string',
      width: 200,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 200,
      editable: true,
    },
    {
      field: 'sender_name',
      headerName: 'Sender',
      width: 200,
      editable: true,
    },
    {
      field: 'read',
      headerName: 'Status',
      width: 200,
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 500,
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      width: 300,
      renderCell: (params) => {
        const confirm_event = async(e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          
          if (params.row.notification_type === 'invite to an event')
          {
            const response = await confirmEvent(params.row.notification_id);
          }
        };

        const read_notification = async(e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          const response = await deleteNotifications(params.row.notification_id);
          
        };

        if (params.row.notification_type === 'invite to an event')
          return (
            <Box m={3}>
              <Button onClick={confirm_event} variant='contained' color='success' >Confirm</Button> 
              <Button onClick={read_notification} variant='contained' color='error'>Ignore</Button>
            </Box>
          );

        return(
          <Box m={10}>
            <Button onClick={read_notification} variant='contained' color='warning'>Read</Button>
          </Box>
        );
      },
    },
    {
      field: 'details',
      headerName: 'Details',
      sortable: false,
      width: 300,
      renderCell: (params) => {
        if (params.row.notification_type.includes('file'))
          return(
            <NavLink to='/pdf'>
              <Button variant='contained' color='info'>more details</Button>
            </NavLink>
          );

        return(
          <NavLink to='/calendar'>
            <Button variant='contained' color='info'>more details</Button>
          </NavLink>
        );
      },
    },
  ];

  useEffect( () => {
    async function fetchData() {
      const obj = await getNotifications();
      setNotifications(obj);
    }
    fetchData();
  },[]);

  useEffect(() => {
    async function fetchData() {
      const response = await confirmEvent(eventId);
      window.alert('Event confirmed');
    }
    fetchData();    
  }, [eventId]);
  
  notifications.forEach(function (item) { 
    const time = new Date(item.timestamp);
    item.timestamp = time.toString();
  }); 

  return (
    <div style={{ height: 1080,width: '100%' }}>
      <DataGrid 
        rowHeight={100}
        rows={notifications}
        columns={columns}
        components={{
          Pagination: CustomPagination,
        }}
      />
    </div>
  );
};

export default Notification;