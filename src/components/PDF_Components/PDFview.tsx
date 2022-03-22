import { TextareaAutosize, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { PDFDocument, popGraphicsState } from 'pdf-lib';

import React, { useEffect, useState } from 'react';
import { deleteFile, getFile, recommendFile, reviewFile, updateFile } from '../../api/files';
import { signatureTest } from '../../assets/signature';
import { convertToBase64, PageView } from '../../pages/PDF';
import { CustomModal } from '../Modal';

const iframeStyle = {
  width: '100%', 
  height: '2000px', 
};

interface ModalView
{
  view: 'Nothing'
  | 'PDFHelp'
  | 'Update'
  | 'Delete'
  | 'GiveReview'
  | 'GiveRecommendation'
  | 'InsertSignatureReminder';
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

  const PDFActionInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
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

  async function updatePDF():Promise<boolean>
  {
    setAlert(false);
    setSpinner(true);
    setViewModal(false);

    //Read File
    if (PDFActionInputRef && PDFActionInputRef.current){
      const selectedFile = PDFActionInputRef.current.files;

      const selectedFileID = fileID;
      //Check File is not Empty
      if (selectedFile && selectedFile.length > 0) {

        if (!selectedFile[0].name.match(/.(pdf)$/i))
        {
          setAlertMessage('Please provide a PDF file to upload');
          setAlertStatus('error');
          setAlert(true);
          setSpinner(false);
          return false;
        }

        const base64 = await convertToBase64(selectedFile[0])
          .catch((error) => {
            setAlertMessage(error);
            setAlertStatus('error');
            setAlert(true);
            setSpinner(false);
            return false;
          });

        updateFile(base64 as string, selectedFileID, selectedFile[0].name)
          .then((string) => {
            pageChange({view: 'PDF'});
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
      else{
        setAlertMessage('Please Select a File from your computer.');
        setAlertStatus('error');
        setAlert(true);
        setSpinner(false);
        return false;
      }
    }

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
    if (PDFActionInputRef && PDFActionInputRef.current && CommentTextAreaRef && CommentTextAreaRef.current ){
      const selectedFile = PDFActionInputRef.current.files;

      const selectedFileID = fileID;
      //Check File is not Empty
      if (selectedFile && selectedFile.length > 0) {

        if (!selectedFile[0].name.match(/.(pdf)$/i))
        {
          setAlertMessage('Please provide a PDF file to upload');
          setAlertStatus('error');
          setAlert(true);
          setSpinner(false);
          return false;
        }
        
        const comment = CommentTextAreaRef.current.value;
        const base64 = await convertToBase64(selectedFile[0])
          .catch((error) => {
            setAlertMessage(error);
            setAlertStatus('error');
            setAlert(true);
            setSpinner(false);
            return false;
          });
        
        await reviewFile(comment, PDFActionSelectValue + 3, base64 as string, selectedFileID)
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
      else{
        setAlertMessage('Please Select a File from your computer.');
        setAlertStatus('error');
        setAlert(true);
        setSpinner(false);
        return false;
      }
    }

    return true;
  }

  async function submitRecommendation(): Promise<boolean>
  {
    setAlert(false);
    setSpinner(true);
    setViewModal(false);

    //Read File
    if (PDFActionInputRef && PDFActionInputRef.current && CommentTextAreaRef && CommentTextAreaRef.current ){
      const selectedFile = PDFActionInputRef.current.files;

      const selectedFileID = fileID;
      //Check File is not Empty
      if (selectedFile && selectedFile.length > 0) {

        if (!selectedFile[0].name.match(/.(pdf)$/i))
        {
          setAlertMessage('Please provide a PDF file to upload');
          setAlertStatus('error');
          setAlert(true);
          setSpinner(false);
          return false;
        }
        
        const comment = CommentTextAreaRef.current.value;
        const base64 = await convertToBase64(selectedFile[0])
          .catch((error) => {
            setAlertMessage(error);
            setAlertStatus('error');
            setAlert(true);
            setSpinner(false);
            return false;
          });
        
        await recommendFile(comment, PDFActionSelectValue == 1, base64 as string, selectedFileID)
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
      else{
        setAlertMessage('Please Select a File from your computer.');
        setAlertStatus('error');
        setAlert(true);
        setSpinner(false);
        return false;
      }
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
      if ((PDFData as any)?.filetype == '1380_form') { 
        signaturePosition = {
          x: 350,
          y: 60,
          width: 50,
          height: 50
        };
      }
      else if ((PDFData as any)?.filetype == 'rst_request') {
        if ((PDFData as any)?.reviewer_visible == false)
        {
          signaturePosition = {
            x: 317,
            y: 205,
            width: 50,
            height: 50
          };
        }
      }
    }
    const signatureImage = await pdfDoc.embedPng(signatureTest);
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
    setViewModal(true);
    console.log(event);

    if (event && event.target && event.target.value == 1)
    {
      console.log(event.target.value);
      setPDFActionSelectValue(0);
      setCurrentModalView({view: 'Update'});
    }

    else if (event && event.target && event.target.value == 2)
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
  }

  async function testtest()
  {
    if (CommentTextAreaRef && CommentTextAreaRef.current)
    {
      console.log(CommentTextAreaRef.current.value);
    }
  }

  useEffect(() => {
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

      {props.PDFviewMode.mode == 'View'  && (PDFData as any)?.filetype == 'rst_request' && <MenuItem value={5}>Insert Signature</MenuItem>}
      {props.PDFviewMode.mode == 'View' && <MenuItem value={1}>Update This PDF</MenuItem>}
      {props.PDFviewMode.mode == 'View' && <MenuItem value={2}>Delete This PDF</MenuItem>}

      {props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == '1380_form' && <MenuItem value={5}>Insert Signature</MenuItem>}
      {props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == '1380_form' && <MenuItem value={6}>Remove Signature</MenuItem>}
      {props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == '1380_form' && <MenuItem value={3}>Give Review</MenuItem>}

      {props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == 'rst_request' && (PDFData as any)?.reviewer_visible == false && <MenuItem value={5}>Insert Signature</MenuItem>}
      {props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == 'rst_request' && (PDFData as any)?.reviewer_visible == false && <MenuItem value={6}>Remove Signature</MenuItem>}
      {props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == 'rst_request' && (PDFData as any)?.reviewer_visible == false && <MenuItem value={4}>Give Recommendation</MenuItem>}
      {props.PDFviewMode.mode == 'Review' && (PDFData as any)?.filetype == 'rst_request' && (PDFData as any)?.reviewer_visible == true && <MenuItem value={3}>Give Review</MenuItem>}

    </Select>

    { currentModalView.view == 'InsertSignatureReminder' && <CustomModal open={viewModal} setOpen={setViewModal}>
      <div>
        <p className='PDFViewMenu'>Signature inserted. Please save the PDF and update it.<br/></p>
      </div>
    </CustomModal>}


    { currentModalView.view == 'Update' && <CustomModal open={viewModal} setOpen={setViewModal}>
      <div>
        <p className='PDFViewMenu'>Please select a file from your computer to replace the current file.<br/></p>
        <Input inputRef = {PDFActionInputRef} type='file'/> 
        <p className='PDFViewMenu'><br/>Press Submit Button to confirm.</p>
        <Button className='PDFViewMenu' onClick={updatePDF}>Submit</Button>
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
          <MenuItem value={1}>Approved</MenuItem>
          <MenuItem value={2}>Rejected</MenuItem>
        </Select>
        <p>Please select a file from your computer to replace the current file.<br/></p>
        <Input inputRef = {PDFActionInputRef} type='file'/> 
        <p><br/>Press Submit Button to confirm.</p>
        <Button onClick={submitReview}>Submit</Button>
      </div>
    </CustomModal>}

    { currentModalView.view == 'GiveRecommendation' && <CustomModal open={viewModal} setOpen={setViewModal}>
      <div className='PDFViewMenu'>
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
        <p>Please select a file from your computer to replace the current file.<br/></p>
        <Input inputRef = {PDFActionInputRef} type='file'/> 
        <p><br/>Press Submit Button to confirm.</p>
        <Button onClick={submitRecommendation}>Submit</Button>
      </div>
    </CustomModal>}

    <iframe src={PDFiframeSrc} style={iframeStyle}></iframe>
  </div>);
};

export default PDFviewPage;