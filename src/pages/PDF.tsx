import {  useState } from 'react';
import React from 'react';
import './PDF.css';

import FullPageLoader from '../components/FullPageLoader';
import AlertBox from '../components/AlertBox';

import Button from '@mui/material/Button';

import { FileUpload } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';

import PDFview from '../components/PDF_Components/PDFview';
import FormList from '../components/PDF_Components/FormList';

export interface PageView
{
  view: 'MainMenu' 
  | 'BlankForms'
  | 'UserFormList'
  | 'PDF'
  | 'ReviewList'
  | 'ReviewPDF'
  | 'ReportList';
}

export async function convertToBase64(file: File): Promise<string>
{
  return new Promise(function(resolve,reject){
    const fileReader = new FileReader();
    let base64 = '';

    // Onload of file read the file content
    fileReader.onload = function(fileLoadedEvent) {
      if (fileLoadedEvent && fileLoadedEvent.target)
      {
        base64 = fileLoadedEvent.target.result as string;
        // Print data in console
        // console.log(base64);

        resolve(base64);
      }
    };

    fileReader.onerror = function(event) {
      if (event)
      {
        console.log(fileReader.error);
        reject('Could not convert file to base 64. Please try again');
      }
    };

    // Convert data to base64
    fileReader.readAsDataURL(file);
  });
}

// report it, request it, review it

const PDFPage = function (): JSX.Element {

  // page variables
  const [currentPageView, setCurrentPageView] = useState<PageView>({view: 'MainMenu'});
  const [previousPageView, setPreviousPageView] = useState<PageView>({view: 'MainMenu'});

  const [fileID, setFileID] = useState<string>('');

  const [spinner, setSpinner] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('success');
  const [viewModal, setViewModal] = useState(false);

  function pageChange(target: PageView, inputFileID?: string)
  {
    setAlert(false);
    const confirmChange = true;
    
    if(target.view == 'PDF' && inputFileID)
    {
      setFileID(inputFileID);
    }

    if(confirmChange)
      setCurrentPageView(target);
  }

  return (
    <div className='PDFPage'>
      {AlertBox(alert, setAlert, alertMessage, alertStatus)}

      {spinner && <FullPageLoader/>}

      {currentPageView.view == 'MainMenu' && <div className='MainMenu'>
        <Button variant='outlined' startIcon={<FileUpload />} onClick={() => pageChange({view: 'ReviewList'})}
          sx={{
            position: 'absolute',
            top: '30%',
            left: '8%',
            marginTop: '-50px',
            marginLeft: '-50px',
            width: '23%',
            height: '23%',
            fontSize: '100%',
            backgroundColor: '#FFC947'
          }}
        >
          Review it
        </Button>

        <Button variant='outlined' startIcon={<AddIcon/>} onClick={() => pageChange({view: 'BlankForms'})}
          sx={{
            position: 'absolute',
            top: '30%',
            left: '42%',
            marginTop: '-50px',
            marginLeft: '-50px',
            width: '23%',
            height: '23%',
            fontSize: '100%',
            backgroundColor: '#FFC947'
          }}
        >
          Request it
        </Button>

        <Button variant='outlined' startIcon={<ViewAgendaIcon/>} onClick={() => pageChange({view: 'ReportList'})}
          sx={{
            position: 'absolute',
            top: '30%',
            left: '75%',
            marginTop: '-50px',
            marginLeft: '-50px',
            width: '23%',
            height: '23%',
            fontSize: '100%',
            backgroundColor: '#FFC947'
          }}
        >
          Report it
        </Button>
      </div>}

      {currentPageView.view == 'ReviewList' && <div className='UserFormListView'>
        <FormList
          viewModal={viewModal}
          setViewModal={setViewModal}
          setSpinner={setSpinner}
          setAlert={setAlert}
          setAlertMessage={setAlertMessage}
          setAlertStatus={setAlertStatus}
          pageChange={pageChange}
          currentPageView={currentPageView}
        />
      </div>}

      {currentPageView.view == 'ReviewPDF' && <div className='PDFview'>
      </div>}

      {currentPageView.view == 'ReportList' && <div className='UserFormListView'>
        <FormList
          viewModal={viewModal}
          setViewModal={setViewModal}
          setSpinner={setSpinner}
          setAlert={setAlert}
          setAlertMessage={setAlertMessage}
          setAlertStatus={setAlertStatus}
          pageChange={pageChange}
          currentPageView={currentPageView}
        />
      </div>}

      {currentPageView.view == 'PDF' && <div className='PDFview'>
        <PDFview
          viewModal={viewModal}
          setViewModal={setViewModal}
          setSpinner={setSpinner}
          setAlert={setAlert}
          setAlertMessage={setAlertMessage}
          setAlertStatus={setAlertStatus}
          pageChange={pageChange}
          fileID={fileID}
        />
      </div>}

    </div>
  );
};

export default PDFPage;