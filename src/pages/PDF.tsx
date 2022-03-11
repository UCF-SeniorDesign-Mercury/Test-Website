import { useEffect, useState } from 'react';
import React from 'react';
import './PDF.css';

import {getUserFiles, reviewUserFiles } from '../api/files';
import { RenderExpandCellGrid } from '../components/RenderExpandCellGrid';
import FullPageLoader from '../components/FullPageLoader';
import AlertBox from '../components/AlertBox';
import { CustomModal } from '../components/Modal';

import Button from '@mui/material/Button';
import { GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

import { FileUpload } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';

import { PDFDocument } from 'pdf-lib';
import Upload from '../components/PDF_Components/Upload';
import PDFview from '../components/PDF_Components/PDFview';

const FormListDataGridCols: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1},
  { field: 'filename', headerName: 'File Name', flex: 1},
  { field: 'status', headerName: 'Status'},
  { field: 'timestamp', headerName: 'Timestamp', flex: 1},
  { field: 'author', headerName: 'Author', flex: 0.5},
  { field: 'reviewer', headerName: 'Reviewer', flex: 0.5},
  { field: 'comment', headerName: 'Comment', flex: 1},
];

interface FormListDataGridRowsType
{
  id: string;
  filename: string;
  status: string;
  timestamp:string;
  author: string;
  reviewer: string;
  comment:string;
}

const BlankFormListDataGridCols: GridColDef[] = [
  { field: 'id', headerName: 'ID'},
  { field: 'filename', headerName: 'File Name'},
];

interface BlankFormListDataGridRowsType
{
  id: string;
  filename: string;
}

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

export interface ModalView
{
  view: 'Nothing'
  | 'Upload'
  | 'UserFormListHelp'
  | 'ReportListHelp'
  | 'PDFHelp'
  | 'Update'
  | 'Delete'
  | 'UpdateStatus'
  | 'UpdateComment';
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

  // page and modal view variables
  const [currentPageView, setCurrentPageView] = useState<PageView>({view: 'MainMenu'});
  const [previousPageView, setPreviousPageView] = useState<PageView>({view: 'MainMenu'});
  const [currentModalView, setCurrentModalView] = useState<ModalView>({view: 'Nothing'});

  // Datagrid variables
  const [DataGridRows, setDataGridRows] = useState<FormListDataGridRowsType[] | BlankFormListDataGridRowsType[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const [spinner, setSpinner] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('success');
  const [viewModal, setViewModal] = useState(false);

  async function getBlankPDFs():Promise<void> 
  {
    const url = 'https://firebasestorage.googleapis.com/v0/b/electric-eagles.appspot.com/o/uploads%2FRST_Blank.pdf?alt=media&token=c2bab592-be4d-4c7e-9ce6-d805cc0daea1';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
  
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
      .catch(err => {
        console.log(err);
        return undefined;
      })
      .then( (res) => {
        console.log('success');
        return res;
      });
    //setPDFiframeSrc(pdfDataUri);
  }

  async function getUserPDFs():Promise<boolean> 
  {
    setAlert(false);
    setSpinner(true);
    await getUserFiles()
      .then((data) => {
        let i = 0;
        for (i = 0; i < (data as any[]).length; i++)
        {
          if (!(data as any[])[i].reviewer_visible)
          {
            (data as any[])[i].reviewer = (data as any[])[i].recommender;
          }
        }
        setDataGridRows(data as FormListDataGridRowsType[]);
      })
      .catch((error) => {
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
        return false;
      });
    setSpinner(false);
    return true;
  }

  async function reviewUserPDFs():Promise<boolean> 
  {
    setAlert(false);
    setSpinner(true);
    await reviewUserFiles()
      .then((data) => {
        setDataGridRows(data as FormListDataGridRowsType[]);
      })
      .catch((error) => {
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
        return false;
      });
    setSpinner(false);
    return true;
  }

  async function pageChange(target: PageView)
  {
    setAlert(false);
    let confirmChange = true;

    if(target.view == 'ReviewList')
    {
      confirmChange = await reviewUserPDFs();
    }

    else if(target.view == 'ReportList')
    {
      confirmChange = await getUserPDFs();
    }

    else if(target.view == 'BlankForms')
    {
      setDataGridRows([{id: '1', filename: 'RST'}]);
    }
    
    else if(target.view == 'UserFormList')
    {
      confirmChange = await getUserPDFs();
    }

    else if(target.view == 'PDF')
    {
      if (selectionModel.length == 0)
      {
        setAlertMessage('Please select a file to view.');
        setAlertStatus('error');
        setAlert(true);
        return;
      }
    }

    if(confirmChange)
      setCurrentPageView(target);
  }

  async function modalChange(target: ModalView | PageView)
  {
    setViewModal(true);
    /*let confirmChange = true;

    if (target.view == 'MainMenu')
    {
      setAlert(false);
      setSpinner(true);
      setViewModal(false);
  
      if (currentModalView.view == 'Update')
      {
        confirmChange = await updatePDF();
      }
      else if (currentModalView.view == 'Delete')
      {
        confirmChange = await deletePDF();
      }

      if(confirmChange)
        await setCurrentPageView({view: 'MainMenu'});
      return;
    }*/

    setCurrentModalView(target as ModalView);
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
        <Button onClick={() => modalChange({view: 'UserFormListHelp'})}>Open Help Menu</Button>
        <CustomModal open={viewModal} setOpen={setViewModal}>
          <p>This is help button screen</p>
        </CustomModal>
        <RenderExpandCellGrid 
          columns = {FormListDataGridCols} 
          rows = {DataGridRows}
          pageSize={5}
          rowsPerPageOptions={[5]}
          onSelectionModelChange={(newSelection => {
            setSelectionModel(newSelection);
          })}
          selectionModel={selectionModel}
          columnVisibilityModel={{
            id: false,
          }}
        />
        <Button onClick={() => pageChange({view: 'PDF'})}
          sx={{
            height: 70,
            width: '100%',
            backgroundColor: '#FFC947',
            fontSize: '100%',
          }}
        >
          Submit</Button>
      </div>}

      {currentPageView.view == 'ReviewPDF' && <div className='PDFview'>
      </div>}

      {currentPageView.view == 'ReportList' && <div className='UserFormListView'>

        {currentModalView.view == 'ReportListHelp' && <CustomModal open={viewModal} setOpen={setViewModal}>
          <p>This is help button screen</p>
        </CustomModal>}

        {currentModalView.view == 'Upload' && <div className='UploadView'>

          <Upload 
            viewModal={viewModal}
            setViewModal={setViewModal}
            setSpinner={setSpinner}
            setAlert={setAlert}
            setAlertMessage={setAlertMessage}
            setAlertStatus={setAlertStatus}
            pageChange={pageChange}
          />
        </div>}
        
        <Button onClick={() => modalChange({view: 'ReportListHelp'})}>Open Help Menu</Button>
        <Button onClick={() => modalChange({view: 'Upload'})}>Submit a form</Button>
        
        <Typography variant="h4" component="div" gutterBottom sx={{
          textAlign: 'center',
        }}>
          Submitted Forms
        </Typography>

        <RenderExpandCellGrid 
          columns = {FormListDataGridCols} 
          rows = {DataGridRows}
          pageSize={5}
          rowsPerPageOptions={[5]}
          onSelectionModelChange={(newSelection => {
            setSelectionModel(newSelection);
          })}
          selectionModel={selectionModel}
          columnVisibilityModel={{
            id: false,
          }}
        />
        <Button onClick={() => pageChange({view: 'PDF'})}
          sx={{
            height: 70,
            width: '100%',
            backgroundColor: '#FFC947',
            fontSize: '100%',
          }}
        >
          Submit</Button>
      </div>}

      {currentPageView.view == 'BlankForms' && <div className='BlankFormsView'>
        <RenderExpandCellGrid 
          columns = {BlankFormListDataGridCols} 
          rows = {DataGridRows}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(newSelection => {
            setSelectionModel(newSelection);
          })}
          selectionModel={selectionModel}
        />
        <Button onClick={() => { getBlankPDFs(); setCurrentPageView({view: 'PDF'}); }}>Submit</Button>
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
          fileID={selectionModel[0] as string}
        />
      </div>}

    </div>
  );
};

export default PDFPage;