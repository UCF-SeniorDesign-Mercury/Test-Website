import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import './PDF.css';

const iframeStyle = {
  width: '100%', 
  height: '900px', 
};

const PDFPage = function (): JSX.Element {
  const [iframeSrc, setiframeSrc] = useState<string | undefined>('about:blank');

  useEffect(() => {
    async function createPdf():Promise<void> {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([350, 400]);
      page.moveTo(110, 200);
      page.drawText('Hello World!');
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
      // console.log('iframeSrc' + iframeSrc);
      // console.log('pdfDataUri' + pdfDataUri);
    }
    createPdf()
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
