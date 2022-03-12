import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import React, { useEffect, useState } from 'react';

import { postFile } from '../../api/files';
import { getUsers } from '../../api/users';
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
  pageChange: (target: PageView) => Promise<void>;
}> = (props: {
  viewModal: boolean;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>; 
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setAlertStatus: React.Dispatch<React.SetStateAction<string>>;
  pageChange: (target: PageView) => Promise<void>;
}) => {
  
  const pageChange = props.pageChange;
  const [viewModal, setViewModal] = [props.viewModal, props.setViewModal];
  const [formType, setFormType] = useState<FormType>({formType: noFormValue});
  // eslint-disable-next-line
  const [extraFormData, setExtraFormData] = useState<any>({});

  const [reviewer, setReviewer] = useState<string>('none');
  const [reviewerList, setReviewerList] = useState<string[]>([]);
  const [recommender, setRecommender] = useState<string>('none');
  const [recommenderList, setRecommenderList] = useState<string[]>([]);

  const setSpinner = props.setSpinner;
  const setAlert = props.setAlert;
  const setAlertMessage = props.setAlertMessage;
  const setAlertStatus = props.setAlertStatus;

  const UploadInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);

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

        const base64 = await convertToBase64(selectedFile[0])
          .catch((error) => {
            setAlertMessage(error);
            setAlertStatus('error');
            setAlert(true);
            setSpinner(false);
            return false;
          });

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
      const officerArr:string[] = [];
      getUsers('target=officer')
        .then((data) => {
          for (let i = 0; i < (data as unknown[]).length; i++)
          {
            // eslint-disable-next-line
            officerArr.push((data as any)[i].name);
          }
          setReviewerList(officerArr);
        })
        .catch((err)=> console.log(err));
    }

    else if (formType.formType == 'rst_request')
    {
      const commanderArr:string[] = [];
      getUsers('target=commander')
        .then((data) => {
          for (let i = 0; i < (data as unknown[]).length; i++)
          {
            // eslint-disable-next-line
            commanderArr.push((data as any)[i].name);
          }
          setReviewerList(commanderArr);
        })
        .catch((err)=> console.log(err));

      const officerArr:string[] = [];
      getUsers('target=officer')
        .then((data) => {
          for (let i = 0; i < (data as unknown[]).length; i++)
          {
            // eslint-disable-next-line
            officerArr.push((data as any)[i].name);
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

        {formType.formType == '1380_form' && <div>
          <p>Please select the officer to sign off.<br/></p>
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
                  <MenuItem key={option} value={option}>
                    {option}
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
                  <MenuItem key={option} value={option}>
                    {option}
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
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })
            }
          </Select>
        </div>}

        <p><br/><br/>Please select the form from your computer to upload.<br/></p>
        <Input type='file' inputRef = {UploadInputRef}/>
        <Button onClick={uploadPDF}><br/>Submit</Button>
      </div>
    </CustomModal>
  </div>);
};

export default UploadPage;