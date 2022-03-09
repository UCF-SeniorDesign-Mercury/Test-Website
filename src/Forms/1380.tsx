import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getUsers } from '../api/users';
import { useState, useEffect } from 'react';
import { FormDataTransferProps, noFormValue } from './form_settings';

export const UploadSection: React.FC<FormDataTransferProps> = (props: FormDataTransferProps) => {
  const [officers, setOfficers] = useState<string[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<string>('none');
  
  async function getOfficers(): Promise<void> {
    const officerArr:string[] = [];
    await getUsers('target=officer')
      .then((data) => {
        for (let i = 0; i < (data as unknown[]).length; i++)
        {
          // eslint-disable-next-line
          officerArr.push((data as any)[i].name);
        }
      });
    setOfficers(officerArr);
  }

  useEffect(() => {
    getOfficers()
      .catch((err)=> console.log(err))
      .then()
      .catch((err)=> console.log(err));
  }, []);

  useEffect(() => {
    props.setData(selectedOfficer);
    console.log(props.data);
    
  }, [selectedOfficer]);

  return (<div>
    <p>Please select the officer to sign off.<br/></p>
    <Select
      value={selectedOfficer}
      onChange={(event) => {
        setSelectedOfficer(event.target.value);
      }}
    >
      <MenuItem disabled key={'none'} value={'none'}>None</MenuItem>
      {
        officers.map(option => {
          return (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          );
        })
      }
    </Select>
  </div>);
};

export const functionList: { [key: string]: any }  = {
  'UploadSection': UploadSection,
};

export const test = () => {
  console.log('testing');
};