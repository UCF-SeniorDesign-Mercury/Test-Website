import { SyntheticEvent, useState } from 'react';
import React from 'react';
import './PDF.css';

import { postFile, getFile, updateFile, deleteFile, getUserFiles } from '../api/files';
import { RenderExpandCellGrid } from '../components/RenderExpandCellGrid';
import FullPageLoader from '../components/FullPageLoader';
import AlertBox from '../components/AlertBox';
import { CustomModal } from '../components/Modal';

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { GridColDef, GridSelectionModel } from '@mui/x-data-grid';

import { FileUpload } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';

import { PDFDocument } from 'pdf-lib';

const iframeStyle = {
  width: '100%', 
  height: '2000px', 
};

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



const PDFPage = function (): JSX.Element {
  const [showMainMenu, setShowMainMenu] = useState<boolean>(true);
  const [showUploadView, setShowUploadView] = useState<boolean>(false);
  const [showBlankFormsView, setShowBlankFormsView] = useState<boolean>(false);
  const [showFormListView, setShowFormListView] = useState<boolean>(false);
  const [showPDFview, setShowPDFview] = useState<boolean>(false);
  const [DataGridRows, setDataGridRows] = useState<FormListDataGridRowsType[] | BlankFormListDataGridRowsType[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const [PDFviewActionSelectValue, setPDFviewActionSelectValue] = useState<number>(0);
  const [PDFviewiframeSrc, setPDFviewiframeSrc] = useState<string | undefined >('about:blank');
  const [PDFAction, setPDFAction] = useState<string>('nothing');
  const [spinner, setSpinner] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('success');
  const [viewModal, setViewModal] = useState(false);
  const [showPDFviewActionInput, setShowPDFviewActionInput] = useState<boolean>(false);

  const UploadViewInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const PDFActionInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const PDFActionSelectRef: React.RefObject<HTMLSelectElement> = React.useRef<HTMLSelectElement>(null);

  async function uploadPDF(/*event: React.MouseEvent<HTMLButtonElement>*/): Promise<void> {

    setAlert(false);
    setSpinner(true);
    setViewModal(false);

    //Read File
    if (UploadViewInputRef && UploadViewInputRef.current){
      const selectedFile = UploadViewInputRef.current.files;
      //Check File is not Empty
      if (selectedFile && selectedFile.length > 0) {

        if (!selectedFile[0].name.match(/.(pdf)$/i))
        {
          setAlertMessage('Please provide a PDF file to upload');
          setAlertStatus('error');
          setAlert(true);
          setSpinner(false);
          return;
        }
        // Select the very first file from list
        const fileToLoad = selectedFile[0];
        // FileReader function for read the file.
        const fileReader = new FileReader();
        let base64;
        // Onload of file read the file content
        fileReader.onload = function(fileLoadedEvent) {
          if (fileLoadedEvent && fileLoadedEvent.target)
          {
            base64 = fileLoadedEvent.target.result;
            // Print data in console
            console.log(base64);

            postFile(base64 as string, 'testfilename.pdf', 'ljwZn5ciNGOGAWBVl0GCNQWXbjk2')
              .then((string) => {
                setAlertMessage(string);
                setAlertStatus('success');
                setAlert(true);
                setSpinner(false);
              })
              .catch((error) => {
                setAlertMessage(error);
                setAlertStatus('error');
                setAlert(true);
                setSpinner(false);
                return;
              });
          }
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
      }
      else{
        setAlertMessage('Please Select a File from your computer.');
        setAlertStatus('error');
        setAlert(true);
        setSpinner(false);
        return;
      }
    }
    else{
      setAlertMessage('Please Select a File from your computer.');
      setAlertStatus('error');
      setAlert(true);
      setSpinner(false);
      return;
    }
  }

  async function getBlankPDFs():Promise<void> 
  {
    const url = 'https://firebasestorage.googleapis.com/v0/b/electric-eagles.appspot.com/o/RST_Request_Form_Blank.pdf?alt=media&token=2fbae07a-1496-49ba-ab74-6cf5dd87f9b2';
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
    setPDFviewiframeSrc(pdfDataUri);
    setShowPDFview(true);
    setShowBlankFormsView(false);
  }

  function handleUploadFileButton()
  {
    setViewModal(true);
    setShowUploadView(true);
  }

  function handleBlankFilesButton()
  {
    setShowMainMenu(false);
    setShowBlankFormsView(true);
    setDataGridRows([{id: '1', filename: 'RST'}]);
  }


  async function handleViewYourFilesButton()
  {
    setAlert(false);
    setShowMainMenu(false);
    setShowFormListView(true);
    setSpinner(true);
    await getUserFiles()
      .then((data) => {
        setDataGridRows(data as FormListDataGridRowsType[]);
      })
      .catch((error) => {
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
      });
    setSpinner(false);
  }

  function handleHelpModalButton()
  {
    setViewModal(true);
  }

  async function handleFormsListButton()
  {
    setAlert(false);

    if (selectionModel.length == 0)
    {
      setAlertMessage('Please select a file to view.');
      setAlertStatus('error');
      setAlert(true);
      return;
    }
    setSpinner(true);
    await getFile(selectionModel[0] as string)
      .then((string) => {
        setPDFviewiframeSrc(string);
        setSpinner(false);
        setShowFormListView(false);
        setShowPDFview(true);
      })
      .catch((error) => {
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
        setSpinner(false);
        return;
      });
  }


  function handlePDFviewActionSelect(event: SelectChangeEvent<unknown>)
  {
    console.log(event);
    if (event && event.target && event.target.value == 1)
    {
      console.log(event.target.value);
      setPDFviewActionSelectValue(0);
      setShowPDFviewActionInput(true);
      setPDFAction('Update');
      setViewModal(true);
    }

    else if (event && event.target && event.target.value == 2)
    {
      console.log(event.target.value);
      setPDFviewActionSelectValue(0);
      setShowPDFviewActionInput(false);
      setPDFAction('Delete');
      setViewModal(true);
    }
  }

  async function handlePDFviewActionSubmit()
  {
    setAlert(false);
    setSpinner(true);
    setViewModal(false);

    if (PDFAction == 'Update')
    {
      //Read File
      if (PDFActionInputRef && PDFActionInputRef.current){
        const selectedFile = PDFActionInputRef.current.files;

        const selectedFileID = selectionModel[0] as string;
        //Check File is not Empty
        if (selectedFile && selectedFile.length > 0) {

          if (!selectedFile[0].name.match(/.(pdf)$/i))
          {
            setAlertMessage('Please provide a PDF file to upload');
            setAlertStatus('error');
            setAlert(true);
            setSpinner(false);
            return;
          }

          // Select the very first file from list
          const fileToLoad = selectedFile[0];
          // FileReader function for read the file.
          const fileReader = new FileReader();
          let base64;
          // Onload of file read the file content
          fileReader.onload = function(fileLoadedEvent) {
            if (fileLoadedEvent && fileLoadedEvent.target)
            {
              base64 = fileLoadedEvent.target.result;
              // Print data in console
              console.log(base64);

              updateFile(base64 as string, selectedFileID, 'testfilename.pdf')
                .then((string) => {
                  setAlertMessage(string);
                  setAlertStatus('success');
                  setAlert(true);
                  setSpinner(false);
                  setShowMainMenu(true);
                  setShowPDFview(false);
                })
                .catch((error) => {
                  setAlertMessage(error);
                  setAlertStatus('error');
                  setAlert(true);
                  setSpinner(false);
                  return;
                });
            }
          };
          // Convert data to base64
          fileReader.readAsDataURL(fileToLoad);
        }
        else{
          setAlertMessage('Please Select a File from your computer.');
          setAlertStatus('error');
          setAlert(true);
          setSpinner(false);
          return;
        }
      }
    }
    else if (PDFAction == 'Delete')
    {
      deleteFile(selectionModel[0] as string)
        .then((string) => {
          setAlertMessage(string);
          setAlertStatus('success');
          setAlert(true);
          setSpinner(false);
          setShowMainMenu(true);
          setShowPDFview(false);
        })
        .catch((error) => {
          setAlertMessage(error);
          setAlertStatus('error');
          setAlert(true);
          setSpinner(false);
          return;
        });
    }
  }

  return (
    <div className='PDFPage'>
      {AlertBox(alert, setAlert, alertMessage, alertStatus)}

      {spinner && <FullPageLoader/>}

      {showMainMenu && <div className='MainMenu'>
        <Button variant='outlined' startIcon={<FileUpload />} onClick={handleUploadFileButton}
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
          Upload a File
        </Button>

        <Button variant='outlined' startIcon={<AddIcon/>} onClick={handleBlankFilesButton}
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
          Create a Blank File
        </Button>

        <Button variant='outlined' startIcon={<ViewAgendaIcon/>} onClick={handleViewYourFilesButton}
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
          View Your Files 
        </Button>
      </div>}

      {showUploadView && <div className='UploadView'>
        <CustomModal open={viewModal} setOpen={setViewModal}>
          <div className='PDFViewMenu'>
            <p >Please select a file from your computer to upload.<br/></p>
            <Input type='file' inputRef = {UploadViewInputRef}/>
            <Button onClick={uploadPDF}><br/>Submit</Button>
          </div>
        </CustomModal>
      </div>}

      {showBlankFormsView && <div className='BlankFormsView'>
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
        <Button onClick={getBlankPDFs}>Submit</Button>
      </div>}

      {showFormListView && <div className='FormListView'>
        <Button onClick={handleHelpModalButton}>Open Help Menu</Button>
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
        <Button onClick={handleFormsListButton}
          sx={{
            height: 70,
            width: '100%',
            backgroundColor: '#FFC947',
            fontSize: '100%',
          }}
        >
          Submit</Button>
      </div>}

      {showPDFview && <div className='PDFview'>
        <Button className='PDFViewMenu' onClick={handleHelpModalButton}>Open Help Menu</Button>
        <Select
          className='PDFViewMenu' 
          labelId="PDFviewSelectLabel"
          id="PDFviewSelect"
          label="Actions"
          value={PDFviewActionSelectValue}
          onChange={handlePDFviewActionSelect}
          ref={PDFActionSelectRef}
        >
          <MenuItem disabled value={0}>Select an Action</MenuItem>
          <MenuItem value={1}>Update This PDF</MenuItem>
          <MenuItem value={2}>Delete This PDF</MenuItem>
        </Select>
        <CustomModal open={viewModal} setOpen={setViewModal}>
          <div>
            { showPDFviewActionInput && 
              <div>
                <p className='PDFViewMenu'>Please select a file from your computer to replace the current file.<br/></p>
                <Input inputRef = {PDFActionInputRef} type='file'/> 
              </div>
            }
            <p className='PDFViewMenu'><br/>Press Submit Button to confirm.</p>
            <Button className='PDFViewMenu' onClick={handlePDFviewActionSubmit}>Submit</Button>
          </div>
        </CustomModal>
        <iframe src={PDFviewiframeSrc} style={iframeStyle}></iframe>
      </div>}

    </div>
  );
};

export default PDFPage;