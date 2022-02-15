import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import './PDF.css';
import { downloadPDF } from '../firebase/firebase';
import { arrayBuffer } from 'stream/consumers';
import Button from 'react-bootstrap/Button';
import React from 'react';
import { getToken } from '../firebase/firebase';
import { getUser, updateUser } from '../api/users';

// import { downloadPDF } from '../firebase/firebase';
// https://stackoverflow.com/questions/31270145/save-pdf-file-loaded-in-iframe

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

  async function iframeFunction(){
    console.log(  getToken());

    const data = {
      display_name: 'hello',
    };
    updateUser(data)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    getUser()
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    
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
      <Button variant="primary" type="submit" onClick={iframeFunction}>
          Update PDF
      </Button>
    </div>
  );
};

export default PDF_TestPage;