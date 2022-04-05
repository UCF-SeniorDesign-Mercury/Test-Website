import { getNotifications } from '../api/notifications';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';


const columns: GridColDef[] = [
  {
    field: 'sender',
    headerName: 'Sender',
    width: 300,
    editable: true,
  },
  {
    field: 'notification_type',
    headerName: 'Type',
    type: 'string',
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
    width: 200,
  },
];

const Notification = function (): JSX.Element {
  const [notifications,setNotifications] = useState([{
    id: '',
    notification_id: '',
    notification_type: '',
    read: true,
    receiver: '',
    sender: '',
    tpye: '', 
    timestamp: null,
  },]);

  useEffect( () => {
    async function fetchData() {
      const obj = await getNotifications();
      console.log('before', obj);
      
      console.log('after', obj);
      setNotifications(obj);
    }
    fetchData();
  },[]);
  
  return (
    <div style={{ height: 1080,width: '100%' }}>
      <DataGrid 
        rowHeight={100}
        rows={notifications}
        columns={columns}
      />
    </div>
  );
};

export default Notification;