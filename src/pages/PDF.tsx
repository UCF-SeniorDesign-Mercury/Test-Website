import { useEffect, useState } from 'react';
import React from 'react';
import './PDF.css';

import { postFile, getFile, updateFile, deleteFile, getUserFiles } from '../api/files';
import { RenderExpandCellGrid } from '../components/RenderExpandCellGrid';

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
  { field: 'id', headerName: 'ID'},
  { field: 'filename', headerName: 'File Name'},
  { field: 'status', headerName: 'Status'},
  { field: 'timestamp', headerName: 'Timestamp'},
  { field: 'author', headerName: 'Author'},
  { field: 'reviewer', headerName: 'Reviewer'},
  { field: 'comment', headerName: 'Comment'},
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

  const UploadViewInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const PDFActionInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  async function uploadPDF(/*event: React.MouseEvent<HTMLButtonElement>*/): Promise<void> {
    //Read File
    if (UploadViewInputRef && UploadViewInputRef.current){
      const selectedFile = UploadViewInputRef.current.files;
      //Check File is not Empty
      if (selectedFile && selectedFile.length > 0) {
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
              .catch(err => console.log(err));
          }
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
      }
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

  async function getPDF(fileID: string): Promise<void> {
    const fileString = await getFile(fileID);
    console.log(fileString);
    setPDFviewiframeSrc(fileString);
  }

  /*async function updatePDF(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    //Read File
    if (getFileUpdateInputEl && getFileUpdateInputEl.current && getFileUpdateStringInputEl && getFileUpdateStringInputEl.current){
      const selectedFile = getFileUpdateInputEl.current.files;
      const selectedFileID = getFileUpdateStringInputEl.current.value;
      //Check File is not Empty
      if (selectedFile && selectedFile.length > 0) {
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

            updateFile(base64 as string, selectedFileID, 'testfilename.pdf');
          }
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
      }
    }
  }*/

  /*async function deletePDF(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    if (getFileDeleteInputEl && getFileDeleteInputEl.current)
    {
      const fileString = await deleteFile(getFileDeleteInputEl.current.value);
    }
  }*/

  function handleUploadFileButton()
  {
    setShowMainMenu(false);
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
    setShowMainMenu(false);
    setShowFormListView(true);
    setDataGridRows(await getUserFiles() as FormListDataGridRowsType[]);
  }

  async function handleFormsListButton()
  {
    setPDFviewiframeSrc(await getFile(selectionModel[0] as string));
    setShowFormListView(false);
    setShowPDFview(true);

  }


  function handlePDFviewActionSelect(event: SelectChangeEvent<unknown>)
  {

    if (event && event.target)
    {
      console.log(event.target.value);
      setPDFviewActionSelectValue(event.target.value as number);
    }
  }

  async function handlePDFviewActionSubmit()
  {
    if (PDFviewActionSelectValue == 2)
    {
      console.log('succsdfasdf');
    }
  }

  return (
    <div>

      {showMainMenu && <div className='MainMenu'>
        <Button variant='outlined' startIcon={<FileUpload />} onClick={handleUploadFileButton}>
          Upload a File
        </Button>

        <Button variant='outlined' startIcon={<AddIcon/>} onClick={handleBlankFilesButton}>
          Create a Blank File
        </Button>

        <Button variant='outlined' startIcon={<ViewAgendaIcon/>} onClick={handleViewYourFilesButton}>
          View Your Files 
        </Button>
      </div>}

      {showUploadView && <div className='UploadView'>
        <Input type='file' inputRef = {UploadViewInputRef}/>
        <Button onClick={uploadPDF}>Submit</Button>
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
        <RenderExpandCellGrid 
          columns = {FormListDataGridCols} 
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
        <Button onClick={handleFormsListButton}>Submit</Button>
      </div>}

      {showPDFview && <div className='PDFview'>
        <Select
          labelId="PDFviewSelectLabel"
          id="PDFviewSelect"
          label="Actions"
          defaultValue={0}
          onChange={handlePDFviewActionSelect}
        >
          <MenuItem disabled value={0}>Please Select an Action</MenuItem>
          <MenuItem value={1}>Upload PDF</MenuItem>
          <MenuItem value={2}>Get PDF</MenuItem>
          <MenuItem value={3}>Update This PDF</MenuItem>
          <MenuItem value={4}>Delete This PDF</MenuItem>
        </Select>
        <Input inputRef = {PDFActionInputRef}/>
        <Button onClick={handlePDFviewActionSubmit}>Submit</Button>
        <iframe src={PDFviewiframeSrc} style={iframeStyle}></iframe>
      </div>}

    </div>
  );
};

export default PDFPage;