import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import React, { useEffect, useState } from 'react';

import { postFile } from '../../api/files';
import { getUsers } from '../../api/users';
import { convertBackendFormName, FormList, FormType, noFormValue } from '../../Forms/form_settings';
import { PageView } from '../../pages/PDF';
import { CustomModal } from '../Modal';

const UploadPage: React.FC<{
  mainViewModal: boolean;
  mainSetViewModal: React.Dispatch<React.SetStateAction<boolean>>; 
  mainSetSpinner: React.Dispatch<React.SetStateAction<boolean>>; 
  mainSetAlert: React.Dispatch<React.SetStateAction<boolean>>;
  mainSetAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  mainSetAlertStatus: React.Dispatch<React.SetStateAction<string>>;
  pageChange: (target: PageView) => void;
}> = (props: {
  mainViewModal: boolean;
  mainSetViewModal: React.Dispatch<React.SetStateAction<boolean>>; 
  mainSetSpinner: React.Dispatch<React.SetStateAction<boolean>>;
  mainSetAlert: React.Dispatch<React.SetStateAction<boolean>>;
  mainSetAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  mainSetAlertStatus: React.Dispatch<React.SetStateAction<string>>;
  pageChange: (target: PageView) => void;
}) => {
  
  const pageChange = props.pageChange;
  const [viewModal, setViewModal] = [props.mainViewModal, props.mainSetViewModal];
  const [formType, setFormType] = useState<FormType>({formType: noFormValue});
  // eslint-disable-next-line
  const [extraFormData, setExtraFormData] = useState<any>({});

  const [reviewer, setReviewer] = useState<string>('none');
  const [reviewerList, setReviewerList] = useState<string[]>([]);
  const [recommender, setRecommender] = useState<string>('none');
  const [recommenderList, setRecommenderList] = useState<string[]>([]);

  // get from props and replace names
  const setSpinner = props.mainSetSpinner;
  const setAlert = props.mainSetAlert;
  const setAlertMessage = props.mainSetAlertMessage;
  const setAlertStatus = props.mainSetAlertStatus;

  const UploadInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);

  async function convertToBase64(file: File): Promise<string>
  {
    return new Promise(function(resolve,reject){
      const fileReader = new FileReader();
      let base64 = '';

      // Onload of file read the file content
      fileReader.onload = function(fileLoadedEvent) {
        if (fileLoadedEvent && fileLoadedEvent.target)
        {
          base64 = fileLoadedEvent.target.result as string;
          // Print data in console
          // console.log(base64);

          resolve(base64);
        }
      };

      fileReader.onerror = function(event) {
        if (event)
        {
          console.log(fileReader.error);
          reject('Could not convert file to base 64. Please try again');
        }
      };

      // Convert data to base64
      fileReader.readAsDataURL(file);
    });
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
          extraFormData,
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