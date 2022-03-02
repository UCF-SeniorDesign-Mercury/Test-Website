import React, { useEffect, useState, lazy } from 'react';
import * as Form1380 from './1380';

export const noFormValue = 'none';

// track names of forms in backend
export interface FormType
{
  formType: 'none'
  | '1380_form'
  | 'rst_request';
}

// track names of forms in backend
export const FormList = [
  '1380_form', 
  'rst_request',
];

// names of forms in frontend
export const FormNameList = [
  '1380', 
  'RST',
];

// links names to form files
const FormFunctionList: { [key: string]: any } = {
  '1380': Form1380.functionList,
};

export function convertBackendFormName(name: string): string
{
  return FormNameList[FormList.indexOf(name)];
}

export function convertFrontendFormName(name: string): string
{
  return FormList[FormNameList.indexOf(name)];
}

export interface FormDataTransferProps
{
  // eslint-disable-next-line
  data: any; 
  // eslint-disable-next-line
  setData: React.Dispatch<React.SetStateAction<any>>;
}

export const GetFormComponent: React.FC<{data: FormDataTransferProps; form: string; functionName: string}> = 
(props: {data: FormDataTransferProps; form: string; functionName: string}) =>
{
  return(<div>
    <h1>ddd</h1>
    {FormFunctionList[props.form][props.functionName](props.data)}
    
    {/*<Form1380.UploadSection {...props.data} />*/}
  </div>);
};
