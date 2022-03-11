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


/*
// links names to form files
const FormFunctionList: { [key: string]: any } = {
  'none': FormNone.functionList,
  '1380': Form1380.functionList,
  'RST': FormRST.functionList,
};

export interface FormDataTransferProps
{
  // eslint-disable-next-line
  data: any; 
  // eslint-disable-next-line
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const DummyComponent: React.FC<unknown> = () => {
  return(<div><h1>dummy</h1></div>);
};

export interface GetFormComponentProps
{
  data: FormDataTransferProps;
  form: FormType; 
  functionName: string;
}

export const GetFormComponent: React.FC<{data: FormDataTransferProps; form: FormType; functionName: string}> = 
(props: {data: FormDataTransferProps; form: FormType; functionName: string}) =>
{

  //const NewComponent = FormFunctionList[convertBackendFormName(props.form.formType as string)][props.functionName](props.data);

  return(<div>
    {FormFunctionList[convertBackendFormName(props.form.formType as string)][props.functionName](props.data)  }
  </div>);

};
*/

/*<GetFormComponent data={{data: UploadFormExtraData, setData: setUploadFormExtraData}} form={formType} functionName='UploadSection'/>*/