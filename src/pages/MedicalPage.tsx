import {  useEffect, useState } from 'react';
import React from 'react';

import FullPageLoader from '../components/FullPageLoader';
import AlertBox from '../components/AlertBox';
import { getMedicalData } from '../api/medical';

const MedicalPage = function (): JSX.Element {

  // page variables

  const [spinner, setSpinner] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('success');

  async function getMedicalStuff():Promise<boolean> 
  {
    setAlert(false);
    setSpinner(true);

    await getMedicalData()
      .then(async (data) => {
        console.log(data);
        setSpinner(false);
      })
      .catch(() => {
        setAlertMessage('Cannot obtain medical data');
        setAlertStatus('error');
        setAlert(true);
        setSpinner(false);
        return false;
      });

    return true;
  }

  useEffect(() => {
    getMedicalStuff()
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='MedicalPage'>
      {AlertBox(alert, setAlert, alertMessage, alertStatus)}

      {spinner && <FullPageLoader/>}

      <p>HIIII</p>

    </div>
  );
};

export default MedicalPage;