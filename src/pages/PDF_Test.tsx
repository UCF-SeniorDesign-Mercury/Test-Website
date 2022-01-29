import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import './PDF.css';
import { downloadPDF } from '../firebase/firebase';
import { arrayBuffer } from 'stream/consumers';
import Button from 'react-bootstrap/Button';
import React from 'react';

import { postFile } from '../api/files';
// import { downloadPDF } from '../firebase/firebase';
// https://stackoverflow.com/questions/31270145/save-pdf-file-loaded-in-iframe

const iframeStyle = {
  width: '100%', 
  height: '2000px', 
};

const PDF_TestPage = function (): JSX.Element {
  const [iframeSrc, setiframeSrc] = useState<string | undefined >('about:blank');
  const inputEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);

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
            //console.log(base64);

            const requestBody = {
              file: base64,
              filename: 'testfilename',
              reviewer: 'ljwZn5ciNGOGAWBVl0GCNQWXbjk2',

            };

            postFile(requestBody);
          }
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
      }
    }
  }

  function iframeFunction(){
    console.log('function');
    
  }

  useEffect(() => {
    async function modifyPdf() {
      const url = 'https://firebasestorage.googleapis.com/v0/b/electric-eagles.appspot.com/o/uploads%2Frst.pdf?alt=media&token=37e78899-529a-4489-9f2e-58b096e4eef8';
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
    modifyPdf()
      .catch(err => console.log(err))
      .then( () => console.log('success'))
      .catch(() => 'obligatory catch');

  });

  return (
    <div>
      <iframe id="pdfiframe" src={iframeSrc} style={iframeStyle}></iframe>
      <input id="inputFile" type="file" ref = {inputEl}/>
      <Button variant="primary" type="submit" onClick={uploadPDF}>
          Save
      </Button>
      {iframeFunction()}
    </div>
  );
};

export default PDF_TestPage;