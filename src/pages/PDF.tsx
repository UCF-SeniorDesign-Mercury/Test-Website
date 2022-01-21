import { PDFDocument, StandardFonts } from 'pdf-lib';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import './PDF.css';
import { downloadPDF } from '../firebase/firebase';
// import { downloadPDF } from '../firebase/firebase';


const iframeStyle = {
  width: '100%', 
  height: '2000px', 
};

const PDFPage = function (): JSX.Element {
  const [iframeSrc, setiframeSrc] = useState<string | undefined >('about:blank');

  // async function handleOnLogin(email: string, password: string): Promise<boolean | undefined> {

  async function byteDownload(){
    const bytes = await downloadPDF('RST_base64.txt');
    // const bytesString = bytes.toString();
    // console.log(bytes);
    return bytes;
    
  }
  

  useEffect(() => {
    async function modifyPdf() {
      const url = 'https://firebasestorage.googleapis.com/v0/b/electric-eagles.appspot.com/o/RST_Request_Form_Blank.pdf?alt=media&token=2fbae07a-1496-49ba-ab74-6cf5dd87f9b2';
      const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
      // const pages = pdfDoc.getPages();
      // const firstPage = pages[0];
      // eslint-disable-next-line
      // const { width, height } = firstPage.getSize();
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
      // console.log(pdfDataUri);
      setiframeSrc(await byteDownload());
    
      // the saved pdf
      // const pdfBytes = await pdfDoc.save();
      // console.log(pdfBytes);
    }
    modifyPdf()
      .catch(err => console.log(err))
      .then( () => console.log('success'))
      .catch(() => 'obligatory catch');
  });

  return (
    <div>
      <iframe src={iframeSrc} style={iframeStyle}></iframe>
    </div>
  );
};

export default PDFPage;


// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useEffect, useState } from 'react';
// import { PDFDocument } from 'pdf-lib';
// import './PDF.css';

// const iframeStyle = {
//   width: '100%', 
//   height: '900px', 
// };

// const PDFPage = function (): JSX.Element {
//   const [iframeSrc, setiframeSrc] = useState<string | undefined>('about:blank');

//   useEffect(() => {
//     async function createPdf():Promise<void> {
//       const pdfDoc = await PDFDocument.create();
//       const page = pdfDoc.addPage([350, 400]);
//       page.moveTo(110, 200);
//       page.drawText('Hello World!');
//       const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
//         .catch(err => {
//           console.log(err);
//           return undefined;
//         })
//         .then( (res) => {
//           console.log('success');
//           return res;
//         });
//       setiframeSrc(pdfDataUri);
//       // console.log('iframeSrc' + iframeSrc);
//       // console.log('pdfDataUri' + pdfDataUri);
//     }
//     createPdf()
//       .catch(err => console.log(err))
//       .then( () => console.log('success'))
//       .catch(() => 'obligatory catch');
//   });

//   return (
//     <div>
//       <iframe src={iframeSrc} style={iframeStyle}></iframe>
//     </div>
//   );
// };