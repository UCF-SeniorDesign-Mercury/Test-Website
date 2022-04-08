import { getNotifications } from '../api/notifications';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { confirmEvent } from '../api/events';

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
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          
          if (params.row.notification_type === 'invite to an event')
          {
            setEventId(params.row.notification_id);
          }
        };
        return <Button onClick={onClick}>Confirm</Button>;
      },
    },
  ];

  useEffect( () => {
    async function fetchData() {
      const obj = await getNotifications();
      console.log('before', obj);
      
      console.log('after', obj);
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
  
  console.log(typeof(notifications[0].timestamp));
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