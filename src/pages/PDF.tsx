import mainContext from '../context/MainContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import './PDF.css';

function SubmitHandler(event: any): void {
  const context = useContext(mainContext);

  // prevents submit button to reload page
  event.preventDefault();
  context.logout();
}

const iframeStyle = {
  width: '100%', 
  height: '900px', 
};

const PDFPage = function (): JSX.Element {
  const context = useContext(mainContext);
  const [iframeSrc, setiframeSrc] = useState('about:blank');

  useEffect(() => {
    async function createPdf() {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([350, 400]);
      page.moveTo(110, 200);
      page.drawText('Hello World!');
      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      setiframeSrc(pdfDataUri);
      // console.log('iframeSrc' + iframeSrc);
      // console.log('pdfDataUri' + pdfDataUri);
    }
    createPdf();
  });

  return (
    <div>
      <iframe src={iframeSrc} style={iframeStyle}></iframe>
    </div>
  );
};

export default PDFPage;
