import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import './PDF.css';


const iframeStyle = {
  width: '100%', 
  height: '2000px', 
};

const PDF_TestPage = function (): JSX.Element {
  const [iframeSrc, setiframeSrc] = useState<string | undefined>('about:blank');

  useEffect(() => {
    async function modifyPdf() {
      const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf';
      const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      // eslint-disable-next-line
      const { width, height } = firstPage.getSize();
      firstPage.drawText('Testing writing on a form :)', {
        x: 5,
        y: height / 2 + 300,
        size: 50,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45),
      });

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
        .catch(err => {
          console.log(err);
          return undefined;
        })
        .then( (res) => {
          console.log('success');
          return res;
        });
      setiframeSrc(pdfDataUri);
    
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
      <iframe src={iframeSrc} style={iframeStyle}></iframe>
    </div>
  );
};

export default PDF_TestPage;