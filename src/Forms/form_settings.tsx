import React, { useState, useEffect } from 'react';
import * as FormNone from './None';
import * as Form1380 from './1380';
import * as FormRST from './RST';

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
  'none': FormNone.functionList,
  '1380': Form1380.functionList,
  'RST': FormRST.functionList,
};

export function convertBackendFormName(name: string): string
{
  if (name == noFormValue)
    return noFormValue;
  return FormNameList[FormList.indexOf(name)];
}

export function convertFrontendFormName(name: string): string
{
  if (name == noFormValue)
    return noFormValue;
  return FormList[FormNameList.indexOf(name)];
}

export interface FormDataTransferProps
{
  // eslint-disable-next-line
  data: any; 
  // eslint-disable-next-line
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const dummyComponent: React.FC<void> = () => {
  return(<div><h1>dummy</h1></div>);
};

export const GetFormComponent: React.FC<{data: FormDataTransferProps; form: FormType; functionName: string}> = 
(props: {data: FormDataTransferProps; form: FormType; functionName: string}) =>
{
  return(<div>
    {FormFunctionList[convertBackendFormName(props.form.formType as string)][props.functionName](props.data)}
    {/*<Form1380.UploadSection {...props.data} />*/}


  </div>);
};
