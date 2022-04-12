import {  } from '../components/PDF_Components/PDFview';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { confirmEvent } from '../api/events';
import { Box } from '@mui/system';
import { deleteNotifications, getNotifications } from '../api/notifications';
import { NavLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import AlertBox from '../components/AlertBox';

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

interface notification {
  id: string;
  notification_id: string;
  notification_type: string;
  read: boolean;
  receiver: string;
  sender: string;
  tpye: string;
  timestamp: string;
  status: string;
}

const Notification = function (): JSX.Element {
  const [notifications,setNotifications] = useState<notification[]>([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('success');

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
      field: 'status',
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
            const response: number = await confirmEvent(params.row.id);
            
            if (response === 200)
            {
              const response: number = await deleteNotifications(params.row.notification_id);
              if (response === 200)
              {
                setAlertMessage('Event Confirmed!');
                setAlertStatus('success');
                setAlert(true);
                params.row.delete();
                setTimeout(()=>{setAlert(false);}, 5000);
              }
              else
              {
                setAlertMessage('Error! please try again later.');
                setAlertStatus('error');
                setAlert(true);
                setTimeout(()=>{setAlert(false);}, 5000);
              }
            }
            else
            {
              setAlertMessage('Error! please try again later.');
              setAlertStatus('error');
              setAlert(true);
              setTimeout(()=>{setAlert(false);}, 5000);
            }
          }
        };

        const read_notification = async(e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          const response: number = await deleteNotifications(params.row.notification_id);
          if (response === 200)
          {
            setAlertMessage('Acknowledged the Notification');
            setAlertStatus('success');
            setAlert(true);
            setTimeout(()=>{setAlert(false);}, 5000);
          }
          else
          {
            setAlertMessage('Error! please try again later.');
            setAlertStatus('error');
            setAlert(true);
            setTimeout(()=>{setAlert(false);}, 5000);
          }
        };

        if (params.row.notification_type === 'invite to an event')
          return (
            <Box m={3}>
              <Button onClick={confirm_event} variant='contained' color='success' >Confirm</Button> 
              <Button onClick={read_notification} variant='contained' color='error'>Ignore</Button>
            </Box>
          );

        return(
          <Box m={6}>
            <Button onClick={read_notification} variant='contained' color='warning'>Acknowledge</Button>
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
  
  notifications.forEach(function (item) { 
    item.status = item.read ? 'No Action Required' : 'Action Required';
    const time = new Date(item.timestamp);
    item.timestamp = time.toString();
  }); 

  return (
    <Box >
      {AlertBox(alert, setAlert, alertMessage, alertStatus)}
      <Box style={{ height: 1080,width: '100%' }}>
        <br/>
        <Typography variant='h2' align='center' fontFamily={'Fantasy, Copperplate'}>
          Notifications
        </Typography>
        <br/>
        <DataGrid 
          rowHeight={100}
          rows={notifications}
          columns={columns}
          components={{
            Pagination: CustomPagination,
          }}
        />
      </Box>
    </Box>
    
  );
};

export default Notification;