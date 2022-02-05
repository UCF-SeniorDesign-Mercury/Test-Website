import { useEffect, useState } from 'react';
import React from 'react';
import './PDF.css';

import { postFile, getFile, updateFile, deleteFile } from '../api/files';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

const iframeStyle = {
  width: '100%', 
  height: '2000px', 
};

const PDFPage = function (): JSX.Element {
  const [showPDFview, setShowPDFview] = useState<boolean>(true);
  const [showPDFviewActionInput, setShowPDFviewActionInput] = useState<boolean>(false);
  const [showPDFviewActionSubmit, setShowPDFviewActionSubmit] = useState<boolean>(false);
  const [PDFviewActionSelectValue, setPDFviewActionSelectValue] = useState<number>(0);
  const [PDFviewiframeSrc, setPDFviewiframeSrc] = useState<string | undefined >('about:blank');

  const PDFActionInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const PDFActionSubmitRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  /*async function uploadPDF(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    //Read File
    if (inputEl && inputEl.current){
      const selectedFile = inputEl.current.files;
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

            postFile(base64 as string, 'testfilename.pdf', 'ljwZn5ciNGOGAWBVl0GCNQWXbjk2', 'this is signatire');
          }
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
      }
    }
  }*/

  async function getPDF(): Promise<void> {
    if (PDFActionInputRef && PDFActionInputRef.current)
    {
      const fileString = await getFile(PDFActionInputRef.current.value);
      console.log(fileString);
      setPDFviewiframeSrc(fileString);
    }
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

  function handlePDFviewActionSelect(event: SelectChangeEvent<unknown>)
  {
    setShowPDFviewActionInput(true);
    setShowPDFviewActionSubmit(true);

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
      await getPDF();
    }
  }

  useEffect(() => {

  });

  return (
    <div>
      {showPDFview && <div className='PDFview'>
        <Select
          labelId="PDFviewSelectLabel"
          id="PDFviewSelect"
          label="Actions"
          value={0}
          onChange={handlePDFviewActionSelect}
        >
          <MenuItem disabled value={0}>Please Select an Action</MenuItem>
          <MenuItem value={1}>Upload PDF</MenuItem>
          <MenuItem value={2}>Get PDF</MenuItem>
          <MenuItem value={3}>Update PDF</MenuItem>
          <MenuItem value={4}>Delete PDF</MenuItem>
        </Select>
        {showPDFviewActionInput && <Input inputRef = {PDFActionInputRef}/>}
        {showPDFviewActionSubmit && <Button onClick={handlePDFviewActionSubmit}>Submit</Button>}
        <iframe src={PDFviewiframeSrc} style={iframeStyle}></iframe>
      </div>}
    </div>
  );
};

export default PDFPage;