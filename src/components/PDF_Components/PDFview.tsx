import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { PDFDocument } from 'pdf-lib';

import React, { useEffect, useState } from 'react';
import { deleteFile, getFile, updateFile } from '../../api/files';
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
  | 'UpdateStatus'
  | 'UpdateComment';
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
}> = (props: {
  viewModal: boolean;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>; 
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setAlertStatus: React.Dispatch<React.SetStateAction<string>>;
  pageChange: (target: PageView) => void;
  fileID: string;
}) => {

  const fileID = props.fileID;
  const [PDFiframeSrc, setPDFiframeSrc] = useState<string | undefined>('about:blank');

  const PDFActionInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const PDFActionSelectRef: React.RefObject<HTMLSelectElement> = React.useRef<HTMLSelectElement>(null);
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
      .then(async (string) => {
        //setPDFviewiframeSrc(string);
        setPDFiframeSrc(await insertSignature(string));
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

  async function insertSignature(fileString: string): Promise<string> {
  
    const pdfDoc = await PDFDocument.load(fileString);
  
    // const pages = pdfDoc.getPages();
    // const firstPage = pages[0];
    // console.log(pdfDoc.getForm().getFields());
    // eslint-disable-next-line
    // const { width, height } = firstPage.getSize();
    const signatureImage = await pdfDoc.embedPng(signatureTest);
    pdfDoc.getPage(0).drawImage(signatureImage, {
      x: 165,
      y: 225,
      width: 50,
      height: 50
    });

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
  }

  useEffect(() => {
    getPDF()
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(<div>
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
      <MenuItem value={1}>Update This PDF</MenuItem>
      <MenuItem value={2}>Delete This PDF</MenuItem>
      <MenuItem value={1}>Update Review Status</MenuItem>
      <MenuItem value={2}>Update Comment</MenuItem>
    </Select>
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
    <iframe src={PDFiframeSrc} style={iframeStyle}></iframe>
  </div>);
};

export default PDFviewPage;