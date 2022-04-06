import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { PDFDocument } from 'pdf-lib';

import React, { useEffect, useState } from 'react';

import { postFile } from '../../api/files';
import { getUser, getUsers } from '../../api/users';
import { convertBackendFormName, FormList, FormType, noFormValue } from '../../Forms/form_settings';
import { convertToBase64, PageView } from '../../pages/PDF';
import { CustomModal } from '../Modal';

const UploadPage: React.FC<{
  viewModal: boolean;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>; 
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>; 
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setAlertStatus: React.Dispatch<React.SetStateAction<string>>;
  pageChange: (target: PageView) => void;
}> = (props: {
  viewModal: boolean;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>; 
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setAlertStatus: React.Dispatch<React.SetStateAction<string>>;
  pageChange: (target: PageView) => void;
}) => {
  
  const pageChange = props.pageChange;
  const [viewModal, setViewModal] = [props.viewModal, props.setViewModal];
  const [formType, setFormType] = useState<FormType>({formType: noFormValue});
  // eslint-disable-next-line
  const [extraFormData, setExtraFormData] = useState<any>({});

  const [reviewer, setReviewer] = useState<string>('none');
  const [reviewerList, setReviewerList] = useState<{name: string; dod: string}[]>([]);
  const [recommender, setRecommender] = useState<string>('none');
  const [recommenderList, setRecommenderList] = useState<{name: string; dod: string}[]>([]);

  const setSpinner = props.setSpinner;
  const setAlert = props.setAlert;
  const setAlertMessage = props.setAlertMessage;
  const setAlertStatus = props.setAlertStatus;

  const UploadInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  
  async function insertSignature(fileString: string): Promise<string> {
    const pdfDoc = await PDFDocument.load(fileString);
  
    // const pages = pdfDoc.getPages();
    // const firstPage = pages[0];
    // console.log(pdfDoc.getForm().getFields());
    // eslint-disable-next-line
    // const { width, height } = firstPage.getSize();
    const signaturePosition: {x:number; y: number; width: number; height: number} = {
      x: 165,
      y: 225,
      width: 50,
      height: 50
    };


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

  async function uploadPDF(): Promise<boolean> {

    setAlert(false);
    setSpinner(true);
    setViewModal(false);

    //Read File
    if (UploadInputRef && UploadInputRef.current){
      const selectedFile = UploadInputRef.current.files;
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

        let base64 = await convertToBase64(selectedFile[0])
          .then(async (fileString) => {
            console.log(fileString);
            if (formType.formType == 'rst_request')
            {
              const newfile = await insertSignature(fileString as string);
              return newfile;
            }

            return fileString;
          }) 

          .catch((error) => {
            setAlertMessage(error);
            setAlertStatus('error');
            setAlert(true);
            setSpinner(false);
            return false;
          });

        const pdfDoc = await PDFDocument.load(base64 as string);
        pdfDoc.getForm().flatten();
        base64 = await pdfDoc.saveAsBase64({ dataUri: true });

        const parameters: [string, string, string, string, string | undefined] = [
          base64 as string,
          selectedFile[0].name,
          formType.formType,
          reviewer,
          formType.formType == 'rst_request' ? recommender : undefined,
        ];

        postFile(...parameters)
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
    else{
      setAlertMessage('Please Select a File from your computer.');
      setAlertStatus('error');
      setAlert(true);
      setSpinner(false);
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (formType.formType == '1380_form') {
      const officerArr:{name: string; dod: string}[] = [];
      getUsers('target=officer')
        .then((data) => {
          for (let i = 0; i < (data as unknown[]).length; i++)
          {
            // eslint-disable-next-line
            officerArr.push({name: (data as any)[i].name as string, dod: (data as any)[i].dod as string});
          }
          setReviewerList(officerArr);
        })
        .catch((err)=> console.log(err));
    }

    else if (formType.formType == 'rst_request')
    {
      const commanderArr:{name: string; dod: string}[] = [];
      getUsers('target=commander')
        .then((data) => {
          for (let i = 0; i < (data as unknown[]).length; i++)
          {
            // eslint-disable-next-line
            commanderArr.push({name: (data as any)[i].name as string, dod: (data as any)[i].dod as string});
          }
          setReviewerList(commanderArr);
        })
        .catch((err)=> console.log(err));

      const officerArr:{name: string; dod: string}[] = [];
      getUsers('target=officer')
        .then((data) => {
          for (let i = 0; i < (data as unknown[]).length; i++)
          {
            // eslint-disable-next-line
            officerArr.push({name: (data as any)[i].name as string, dod: (data as any)[i].dod as string});
          }
          setRecommenderList(officerArr);
        })
        .catch((err)=> console.log(err));
    }
  }, [formType]);
    

  return(<div>
    <CustomModal open={viewModal} setOpen={setViewModal}>
      <div className='PDFViewMenu'>

        <p>Please select the type of form being submitted.<br/></p>
        <Select
          labelId="PDFviewSelectLabel"
          id="PDFviewSelect"
          label="Actions"
          value={formType.formType}
          onChange={(event) => {
            setFormType({formType: event.target.value as FormType['formType']});
          }}
        >
          <MenuItem disabled value={noFormValue}>{noFormValue}</MenuItem>
          {FormList.map(option => {
            return (
              <MenuItem key={option} value={option}>
                {convertBackendFormName(option)}
              </MenuItem>
            );
          })}
        </Select>

        <p><br/></p>

        {formType.formType == '1380_form' && <div>
          <p><br/>Please select the officer to sign off.</p>
          <Select
            value={reviewer}
            onChange={(event) => {
              setReviewer(event.target.value);
            }}
          >
            <MenuItem disabled key={'none'} value={'none'}>None</MenuItem>
            {
              reviewerList.map(option => {
                return (
                  <MenuItem key={option.dod} value={option.dod}>
                    {option.name}
                  </MenuItem>
                );
              })
            }
          </Select>
        </div>}

        {formType.formType == 'rst_request' && <div>
          <p>Please select the officer to sign off.<br/></p>
          <Select
            value={recommender}
            onChange={(event) => setRecommender(event.target.value)}
          >
            <MenuItem disabled key={noFormValue} value={noFormValue}>{noFormValue}</MenuItem>
            {
              recommenderList.map(option => {
                return (
                  <MenuItem key={option.dod} value={option.dod}>
                    {option.name}
                  </MenuItem>
                );
              })
            }
          </Select>

          <p><br/>Please select the reviewer to sign off.<br/></p>
          <Select
            value={reviewer}
            onChange={(event) => setReviewer(event.target.value)}
          >
            <MenuItem disabled key={noFormValue} value={noFormValue}>{noFormValue}</MenuItem>
            {
              reviewerList.map(option => {
                return (
                  <MenuItem key={option.dod} value={option.dod}>
                    {option.name}
                  </MenuItem>
                );
              })
            }
          </Select>
        </div>}

        <p><br/>Please select the form from your computer to upload.<br/></p>
        <Input type='file' inputRef = {UploadInputRef}/>
        <Button onClick={uploadPDF}><br/>Submit</Button>
      </div>
    </CustomModal>
  </div>);
};

export default UploadPage;