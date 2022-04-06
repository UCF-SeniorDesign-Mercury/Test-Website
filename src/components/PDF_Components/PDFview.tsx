import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { PDFDocument } from 'pdf-lib';

import React, { useEffect, useState } from 'react';
import { deleteFile, getFile, recommendFile, reviewFile, } from '../../api/files';
import { getUser } from '../../api/users';
import { Checkmark } from '../../assets/checkmark';
import { PageView } from '../../pages/PDF';
import { CustomModal } from '../Modal';

const iframeStyle = {
  width: '100%', 
  height: '2000px', 
};

interface ModalView
{
  view: 'Nothing'
  | 'PDFHelp'
  | 'Delete'
  | 'GiveReview'
  | 'GiveRecommendation'
  | 'InsertSignatureReminder'
  | 'TimestampHistory';
}

export interface PDFviewMode {
  mode: 'View' | 'Review';
}

const PDFviewPage: React.FC<{
  viewModal: boolean;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>; 
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setAlertStatus: React.Dispatch<React.SetStateAction<string>>;
  pageChange: (target: PageView) => void;
  fileID: string;
  PDFviewMode: PDFviewMode;
}> = (props: {
  viewModal: boolean;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>; 
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setAlertStatus: React.Dispatch<React.SetStateAction<string>>;
  pageChange: (target: PageView) => void;
  fileID: string;
  PDFviewMode: PDFviewMode;
}) => {
  const fileID = props.fileID;
  const [PDFiframeSrc, setPDFiframeSrc] = useState<string | undefined>('about:blank');
  const [PDFData, setPDFData] = useState<unknown>();

  const [userDODID , setUserDODID] = useState<string>('');

  const PDFActionSelectRef: React.RefObject<HTMLSelectElement> = React.useRef<HTMLSelectElement>(null);
  const CommentTextAreaRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const [PDFActionSelectValue, setPDFActionSelectValue] = useState<number>(0);
  
  const [viewModal, setViewModal] = [props.viewModal, props.setViewModal];
  const [currentModalView, setCurrentModalView] = useState<ModalView>({view: 'Nothing'});
  const pageChange = props.pageChange;

  const setSpinner = props.setSpinner;
  const setAlert = props.setAlert;
  const setAlertMessage = props.setAlertMessage;
  const setAlertStatus = props.setAlertStatus;

  async function getPDF():Promise<boolean> 
  {
    setAlert(false);
    console.log(fileID);
    setSpinner(true);

    await getFile(fileID)
      .then(async (data) => {
        //setPDFviewiframeSrc(string);
        console.log(data);
        setPDFData(data);
        // eslint-disable-next-line
        if (!((data as any).file as string).startsWith('data:application/pdf;base64,'))
          // eslint-disable-next-line
          (data as any).file = 'data:application/pdf;base64,'.concat(((data as any).file as string));
        // eslint-disable-next-line
        setPDFiframeSrc((data as any).file);
        setSpinner(false);
      })
      .catch((error) => {
        pageChange({view: 'MainMenu'});
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
        setSpinner(false);
        return false;
      });

    return true;
  }

  async function deletePDF():Promise<boolean>
  {
    setAlert(false);
    setSpinner(true);
    setViewModal(false);
    
    await deleteFile(fileID)
      .then((string) => {
        pageChange({view: 'MainMenu'});
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
        return false;
      });

    return true;
  }

  async function submitReview(): Promise<boolean>
  {
    setAlert(false);
    setSpinner(true);
    setViewModal(false);

    //Read File
    if (CommentTextAreaRef && CommentTextAreaRef.current ){


      const comment = CommentTextAreaRef.current.value;
      let selectedFileString = PDFiframeSrc as string;
      const selectedFileID = fileID;

      const pdfDoc = await PDFDocument.load(selectedFileString);
      

      // eslint-disable-next-line
      if ((PDFData as any)?.filetype == 'rst_request') {
        const textProps = {
          x: 470,
          y: 195,
          size: 12,
        };

        pdfDoc.getPage(0).drawText(new Date().toLocaleDateString(), textProps);

        const checkmarkImage = await pdfDoc.embedPng(Checkmark);
        const imageDims = checkmarkImage.scale(0.333);


        let checkmarkProps = {
          x: 131,
          y: 187,
          width: imageDims.width,
          height: imageDims.height,
        };

        if (PDFActionSelectValue == 2)
        {
          checkmarkProps = {
            x: 203,
            y: 187,
            width: imageDims.width,
            height: imageDims.height,
          };
        }
        pdfDoc.getPage(0).drawImage(checkmarkImage, checkmarkProps);

      }

      selectedFileString = await pdfDoc.saveAsBase64({ dataUri: true });
      
      await reviewFile(comment, PDFActionSelectValue + 3, selectedFileString, selectedFileID)
        .then((string) => {
          pageChange({view: 'MainMenu'});
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
          return false;
        });
    }

    return true;
  }

  async function submitRecommendation(): Promise<boolean>
  {
    setAlert(false);
    setSpinner(true);
    setViewModal(false);

    //Read File
    if ( CommentTextAreaRef && CommentTextAreaRef.current ){

      const selectedFileID = fileID;
        
      const comment = CommentTextAreaRef.current.value;
      
      await recommendFile(comment, PDFActionSelectValue == 1, PDFiframeSrc as string, selectedFileID)
        .then((string) => {
          pageChange({view: 'MainMenu'});
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
          return false;
        }); 
    }

    return true;
  }

  async function insertSignature(fileString: string): Promise<string> {

    const pdfDoc = await PDFDocument.load(fileString);
  
    // const pages = pdfDoc.getPages();
    // const firstPage = pages[0];
    // console.log(pdfDoc.getForm().getFields());
    // eslint-disable-next-line
    // const { width, height } = firstPage.getSize();
    let signaturePosition: {x:number; y: number; width: number; height: number} = {
      x: 165,
      y: 225,
      width: 50,
      height: 50
    };

    if (props.PDFviewMode.mode == 'View')
    {
      // eslint-disable-next-line
      if ((PDFData as any)?.filetype == 'rst_request') { 
        signaturePosition = {
          x: 165,
          y: 225,
          width: 50,
          height: 50
        };
      }
    }

    else if (props.PDFviewMode.mode == 'Review')
    {
      // eslint-disable-next-line
      if ((PDFData as any)?.filetype == '1380_form') { 
        signaturePosition = {
          x: 350,
          y: 60,
          width: 50,
          height: 50
        };
      }
      // eslint-disable-next-line
      else if ((PDFData as any)?.filetype == 'rst_request') {
        // eslint-disable-next-line
        if ((PDFData as any)?.status == 1)
        {
          signaturePosition = {
            x: 317,
            y: 205,
            width: 50,
            height: 50
          };
          
          const dateTextProps = {
            x: 470,
            y: 220,
            size: 12,
          };

          pdfDoc.getPage(0).drawText(new Date().toLocaleDateString(), dateTextProps);
        }
      }
    }

    let userSignature = 'blank';
    await getUser()
      .then((data) => {
        // eslint-disable-next-line
        userSignature = (data as any).signature as string;
      });

    const signatureImage = await pdfDoc.embedPng(userSignature);
    pdfDoc.getPage(0).drawImage(signatureImage, signaturePosition);

    //const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
    return new Promise(function(resolve,reject)
    {
      pdfDoc.saveAsBase64({ dataUri: true })
        .then( (res) => {
          console.log('success');
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject('about:blank');
        });
    });
    //console.log(pdfDataUri);  
    // eslint-disable-next-line
    // const pdfBytes = await pdfDoc.save();

  }

  async function handlePDFActionSelect(event: SelectChangeEvent<unknown>)
  {
    console.log(event);

    if (event && event.target && event.target.value == 2)
    {
      console.log(event.target.value);
      setPDFActionSelectValue(0);
      setCurrentModalView({view: 'Delete'});
    }

    else if (event && event.target && event.target.value == 3)
    {
      console.log(event.target.value);
      setPDFActionSelectValue(0);
      setCurrentModalView({view: 'GiveReview'});
    }

    else if (event && event.target && event.target.value == 4)
    {
      console.log(event.target.value);
      setPDFActionSelectValue(0);
      setCurrentModalView({view: 'GiveRecommendation'});
    }

    else if (event && event.target && event.target.value == 5)
    {
      console.log(event.target.value);
      setPDFActionSelectValue(0);
      setPDFiframeSrc(await insertSignature(PDFiframeSrc as string));
      setCurrentModalView({view: 'InsertSignatureReminder'});
    }

    else if (event && event.target && event.target.value == 6)
    {
      getPDF()
        .catch((err) => console.log(err));
      setCurrentModalView({view: 'Nothing'});
    }

    else if (event && event.target && event.target.value == 7)
    {
      console.log(event.target.value);
      setPDFActionSelectValue(0);
      setCurrentModalView({view: 'TimestampHistory'});
    }

    setViewModal(true);
  }

  useEffect(() => {
    getUser()
      .then((data) => {
        setUserDODID((data as any).dod);
      })
      .catch((err) => console.log(err));
    getPDF()
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(<div>

    <Button onClick={() => {
      if (props.PDFviewMode.mode == 'View')
        pageChange({view: 'ReportList'});
      else if(props.PDFviewMode.mode == 'Review')
        pageChange({view: 'ReviewList'});
    }}>Go Back</Button>
    <Button className='PDFViewMenu' onClick={() => {setCurrentModalView({view: 'PDFHelp'}); setViewModal(true);}}>Open Help Menu</Button>
    {currentModalView.view == 'PDFHelp' && <CustomModal open={viewModal} setOpen={setViewModal}>
      <p>This is help button screen</p>
    </CustomModal>}

    <Select
      className='PDFViewMenu' 
      labelId="PDFviewSelectLabel"
      id="PDFviewSelect"
      label="Actions"
      value={PDFActionSelectValue}
      onChange={handlePDFActionSelect}
      ref={PDFActionSelectRef}
    >
      <MenuItem disabled value={0}>Select an Action</MenuItem>

      {<MenuItem value={7}>Timestamp History</MenuItem>}

      {props.PDFviewMode.mode == 'View' && <MenuItem value={2}>Delete This PDF</MenuItem>}
      
      {// eslint-disable-next-line
        props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == '1380_form' && <MenuItem value={5}>Insert Signature</MenuItem>}
      {// eslint-disable-next-line
        props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == '1380_form' && <MenuItem value={6}>Remove Signature</MenuItem>}
      {// eslint-disable-next-line
        props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == '1380_form' && <MenuItem value={3}>Give Review</MenuItem>}

      {// eslint-disable-next-line
        props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == 'rst_request' && (PDFData as any)?.status == 1 && <MenuItem value={5}>Insert Signature</MenuItem>}
      {// eslint-disable-next-line
        props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == 'rst_request' && (PDFData as any)?.status == 1 && <MenuItem value={6}>Remove Signature</MenuItem>}
      {// eslint-disable-next-line
        props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == 'rst_request' && (PDFData as any)?.status == 1 && (PDFData as any)?.recommender == userDODID && <MenuItem value={4}>Give Recommendation</MenuItem>}
      {// eslint-disable-next-line
        props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == 'rst_request' && (PDFData as any)?.status == 2 && (PDFData as any)?.reviewer == userDODID && <MenuItem value={3}>Give Review</MenuItem>}

    </Select>

    { currentModalView.view == 'InsertSignatureReminder' && <CustomModal open={viewModal} setOpen={setViewModal}>
      <div>
        <p className='PDFViewMenu'>Signature inserted. Please save the PDF for your records.<br/></p>
      </div>
    </CustomModal>}

    { currentModalView.view == 'Delete' && <CustomModal open={viewModal} setOpen={setViewModal}>
      <div>
        <p className='PDFViewMenu'><br/>Press Submit Button to confirm.</p>
        <Button className='PDFViewMenu' onClick={deletePDF}>Submit</Button>
      </div>
    </CustomModal>}

    { currentModalView.view == 'GiveReview' && <CustomModal open={viewModal} setOpen={setViewModal}>
      <div className='PDFViewMenu'>
        <p>Please add a comment.</p>
        <TextField multiline label="Add Comment" inputRef={CommentTextAreaRef}/> 
        <p><br/>Please select a file status.</p>
        <Select
          labelId="PDFviewSelectLabel"
          id="PDFviewSelect"
          label="Actions"
          value={PDFActionSelectValue}
          onChange={(event) => {
            console.log(CommentTextAreaRef.current?.value);
        
            if (event && event.target && event.target.value == 1)
            {
              console.log(event.target.value);
              setPDFActionSelectValue(1);
            }
        
            else if (event && event.target && event.target.value == 2)
            {
              console.log(event.target.value);
              setPDFActionSelectValue(2);
            }
          }}
          ref={PDFActionSelectRef}
        >
          <MenuItem disabled value={0}>Select a status</MenuItem>
          <MenuItem value={1}>Approved</MenuItem>
          <MenuItem value={2}>Rejected</MenuItem>
        </Select>
        <p><br/>Press Submit Button to confirm.</p>
        <Button onClick={submitReview}>Submit</Button>
      </div>
    </CustomModal>}

    { currentModalView.view == 'GiveRecommendation' && <CustomModal open={viewModal} setOpen={setViewModal}>
      <div className='PDFViewMenu'>
        <p>Please add a comment.</p>
        <TextField multiline label="Add Comment" inputRef={CommentTextAreaRef}/> 
        <p><br/>Please select a file status.<br/></p>
        <Select
          labelId="PDFviewSelectLabel"
          id="PDFviewSelect"
          label="Actions"
          value={PDFActionSelectValue}
          onChange={(event) => {
            console.log(CommentTextAreaRef.current?.value);
        
            if (event && event.target && event.target.value == 1)
            {
              console.log(event.target.value);
              setPDFActionSelectValue(1);
            }
        
            else if (event && event.target && event.target.value == 2)
            {
              console.log(event.target.value);
              setPDFActionSelectValue(2);
            }
          }}
          ref={PDFActionSelectRef}
        >
          <MenuItem disabled value={0}>Select a status</MenuItem>
          <MenuItem value={1}>Recommend</MenuItem>
          <MenuItem value={2}>Do Not Recommend</MenuItem>
        </Select>
        <p><br/>Press Submit Button to confirm.</p>
        <Button onClick={submitRecommendation}>Submit</Button>
      </div>
    </CustomModal>}

    { currentModalView.view == 'TimestampHistory' && <CustomModal open={viewModal} setOpen={setViewModal}>
      <div className='PDFViewMenu'>
        {
          // eslint-disable-next-line
          ((PDFData as any).timestamp as any[]).map(time => {
            
            return (
              // eslint-disable-next-line
              <p key={((PDFData as any).timestamp as any[]).indexOf(time)}> {time}:      <b>{((PDFData as any).timestamp_string as any[])[((PDFData as any).timestamp as any[]).indexOf(time)]} </b></p>
            );
          })
        }
      </div>
    </CustomModal>}

    <iframe src={PDFiframeSrc} style={iframeStyle}></iframe>
  </div>);
};

export default PDFviewPage;