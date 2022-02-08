import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import './PDF.css';
import { downloadPDF } from '../firebase/firebase';
import { arrayBuffer } from 'stream/consumers';
import Button from 'react-bootstrap/Button';
import React from 'react';
import { getToken } from '../firebase/firebase';
import Input from '@mui/material/Input';


import { postFile, getFile, updateFile, deleteFile } from '../api/files';
import { ConstructionOutlined } from '@mui/icons-material';
// import { downloadPDF } from '../firebase/firebase';
// https://stackoverflow.com/questions/31270145/save-pdf-file-loaded-in-iframe

const iframeStyle = {
  width: '100%', 
  height: '2000px', 
};

const PDF_TestPage = function (): JSX.Element {
  const [iframeSrc, setiframeSrc] = useState<string | undefined >('about:blank');
  const inputEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const getFileInputEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const getFileDeleteInputEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const getFileUpdateInputEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const getFileUpdateStringInputEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const [getFileActivate, setgetFileActivate] = useState<boolean>(false);
  
  // async function handleOnLogin(email: string, password: string): Promise<boolean | undefined> {

  async function byteDownload(){
    const bytes = await downloadPDF('RST_base64.txt');
    // const bytesString = bytes.toString();
    //console.log(bytes);
    return bytes;
    
  } 

  async function uploadPDF(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
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

            postFile(base64 as string, 'testfilename.pdf', 'ljwZn5ciNGOGAWBVl0GCNQWXbjk2');
          }
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
      }
    }
  }

  async function updatePDF(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
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
  }

  async function getPDF(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    if (getFileInputEl && getFileInputEl.current)
    {
      const fileString = await getFile(getFileInputEl.current.value);
      console.log(fileString);
      setgetFileActivate(true);
      setiframeSrc(undefined);
      setiframeSrc(fileString);
    }
  }

  async function deletePDF(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    if (getFileDeleteInputEl && getFileDeleteInputEl.current)
    {
      const fileString = await deleteFile(getFileDeleteInputEl.current.value);
    }
  }


  function iframeFunction(){
    console.log(  getToken());
    
  }

  useEffect(() => {
    async function modifyPdf() {
      const url = 'https://firebasestorage.googleapis.com/v0/b/electric-eagles.appspot.com/o/1380_Blank.pdf?alt=media&token=d21b82a0-2e80-4746-970c-65dd145b93f5';
      const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      //console.log(pdfDoc.getForm().getFields());
      // eslint-disable-next-line
      const { width, height } = firstPage.getSize();
      // firstPage.drawText('Testing writing on a form :)', {
      //   x: 5,
      //   y: height / 2 + 300,
      //   size: 50,
      //   font: helveticaFont,
      //   color: rgb(0.95, 0.1, 0.1),
      //   rotate: degrees(-45),
      // });

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
        .catch(err => {
          console.log(err);
          return undefined;
        })
        .then( (res) => {
          console.log('success');
          return res;
        });
      //console.log(pdfDataUri);
      // setiframeSrc(pdfDataUri);
      setiframeSrc(await byteDownload());
    
      // eslint-disable-next-line
      const pdfBytes = await pdfDoc.save();
    }

    if (!getFileActivate)
    {
      modifyPdf()
        .catch(err => console.log(err))
        .then( () => console.log('success'))
        .catch(() => 'obligatory catch');
    }
  });

  return (
    <div>
      <iframe id="pdfiframe" src={iframeSrc} style={iframeStyle}></iframe>
      <input id="inputFile" type="file" ref = {inputEl}/>
      <Button variant="primary" type="submit" onClick={uploadPDF}>
          Save
      </Button>
      {iframeFunction()}

      <Input placeholder="input file id to get it"  inputRef = {getFileInputEl}/>
      <Button variant="primary" type="submit" onClick={getPDF}>
          Get PDF
      </Button>

      <Input placeholder="input file id to update it"  type="file" inputRef = {getFileUpdateInputEl}/>
      <Input placeholder="input file id string to update it" inputRef = {getFileUpdateStringInputEl}/>
      <Button variant="primary" type="submit" onClick={updatePDF}>
          Update PDF
      </Button>

      <Input placeholder="input file id to delete it"  inputRef = {getFileDeleteInputEl}/>
      <Button variant="primary" type="submit" onClick={deletePDF}>
          Delete PDF
      </Button>
    </div>
  );
};

export default PDF_TestPage;