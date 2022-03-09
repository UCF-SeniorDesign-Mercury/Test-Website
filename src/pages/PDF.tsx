import { useEffect, useState } from 'react';
import React from 'react';
import './PDF.css';

import { postFile, getFile, updateFile, deleteFile, getUserFiles, reviewUserFiles } from '../api/files';
import { RenderExpandCellGrid } from '../components/RenderExpandCellGrid';
import FullPageLoader from '../components/FullPageLoader';
import AlertBox from '../components/AlertBox';
import { CustomModal } from '../components/Modal';
import { FormType, FormList, noFormValue, GetFormComponent, convertBackendFormName} from '../Forms/form_settings';

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

import { FileUpload } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';

import { PDFDocument } from 'pdf-lib';
import { signatureTest } from '../assets/signature';

const iframeStyle = {
  width: '100%', 
  height: '2000px', 
};

const FormListDataGridCols: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1},
  { field: 'filename', headerName: 'File Name', flex: 1},
  { field: 'status', headerName: 'Status'},
  { field: 'timestamp', headerName: 'Timestamp', flex: 1},
  { field: 'author', headerName: 'Author', flex: 0.5},
  { field: 'reviewer', headerName: 'Reviewer', flex: 0.5},
  { field: 'comment', headerName: 'Comment', flex: 1},
];

interface FormListDataGridRowsType
{
  id: string;
  filename: string;
  status: string;
  timestamp:string;
  author: string;
  reviewer: string;
  comment:string;
}

const BlankFormListDataGridCols: GridColDef[] = [
  { field: 'id', headerName: 'ID'},
  { field: 'filename', headerName: 'File Name'},
];

interface BlankFormListDataGridRowsType
{
  id: string;
  filename: string;
}

interface PageView
{
  view: 'MainMenu' 
  | 'BlankForms'
  | 'UserFormList'
  | 'PDF'
  | 'ReviewList'
  | 'ReviewPDF'
  | 'ReportList';
}

interface ModalView
{
  view: 'Nothing'
  | 'Upload'
  | 'UserFormListHelp'
  | 'ReportListHelp'
  | 'PDFHelp'
  | 'Update'
  | 'Delete'
  | 'UpdateStatus'
  | 'UpdateComment';
}

// report it, request it, review it

const PDFPage = function (): JSX.Element {
  const [currentPageView, setCurrentPageView] = useState<PageView>({view: 'MainMenu'});
  const [previousPageView, setPreviousPageView] = useState<PageView>({view: 'MainMenu'});
  const [currentModalView, setCurrentModalView] = useState<ModalView>({view: 'Nothing'});
  const [DataGridRows, setDataGridRows] = useState<FormListDataGridRowsType[] | BlankFormListDataGridRowsType[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  // eslint-disable-next-line
  const [FormComponent, setFormComponent] = useState<React.ReactElement>(<div><p>FORM Component</p></div>);
  const [formType, setFormType] = useState<FormType>({formType: noFormValue});
  // eslint-disable-next-line
  const [UploadFormExtraData, setUploadFormExtraData] = useState<any>(noFormValue);
  const [PDFActionSelectValue, setPDFActionSelectValue] = useState<number>(0);
  const [PDFiframeSrc, setPDFiframeSrc] = useState<string | undefined >('about:blank');
  const [spinner, setSpinner] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('success');
  const [viewModal, setViewModal] = useState(false);

  const UploadInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const PDFActionInputRef: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const PDFActionSelectRef: React.RefObject<HTMLSelectElement> = React.useRef<HTMLSelectElement>(null);

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

        postFile(base64 as string, selectedFile[0].name, 'ljwZn5ciNGOGAWBVl0GCNQWXbjk2')
          .then((string) => {
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

  async function getBlankPDFs():Promise<void> 
  {
    const url = 'https://firebasestorage.googleapis.com/v0/b/electric-eagles.appspot.com/o/uploads%2FRST_Blank.pdf?alt=media&token=c2bab592-be4d-4c7e-9ce6-d805cc0daea1';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
  
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
      .catch(err => {
        console.log(err);
        return undefined;
      })
      .then( (res) => {
        console.log('success');
        return res;
      });
    setPDFiframeSrc(pdfDataUri);
  }

  async function getUserPDFs():Promise<boolean> 
  {
    setAlert(false);
    setSpinner(true);
    await getUserFiles()
      .then((data) => {
        setDataGridRows(data as FormListDataGridRowsType[]);
      })
      .catch((error) => {
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
        return false;
      });
    setSpinner(false);
    return true;
  }

  async function reviewUserPDFs():Promise<boolean> 
  {
    setAlert(false);
    setSpinner(true);
    await reviewUserFiles()
      .then((data) => {
        setDataGridRows(data as FormListDataGridRowsType[]);
      })
      .catch((error) => {
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
        return false;
      });
    setSpinner(false);
    return true;
  }

  async function getPDF():Promise<boolean> 
  {
    setAlert(false);
    console.log(selectionModel[0] as string);

    if (selectionModel.length == 0)
    {
      setAlertMessage('Please select a file to view.');
      setAlertStatus('error');
      setAlert(true);
      return false;
    }

    setSpinner(true);
    await getFile(selectionModel[0] as string)
      .then(async (string) => {
        //setPDFviewiframeSrc(string);
        setPDFiframeSrc(await insertSignature(string));
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

  async function updatePDF():Promise<boolean>
  {
    setAlert(false);
    setSpinner(true);

    //Read File
    if (PDFActionInputRef && PDFActionInputRef.current){
      const selectedFile = PDFActionInputRef.current.files;

      const selectedFileID = selectionModel[0] as string;
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
    
    await deleteFile(selectionModel[0] as string)
      .then((string) => {
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

  async function pageChange(target: PageView)
  {
    setAlert(false);
    let confirmChange = true;

    if(target.view == 'ReviewList')
    {
      confirmChange = await reviewUserPDFs();
    }

    else if(target.view == 'ReportList')
    {
      confirmChange = await getUserPDFs();
    }

    else if(target.view == 'BlankForms')
    {
      setDataGridRows([{id: '1', filename: 'RST'}]);
    }
    
    else if(target.view == 'UserFormList')
    {
      confirmChange = await getUserPDFs();
    }

    else if(target.view == 'PDF')
    {
      confirmChange = await getPDF();
    }

    if(confirmChange)
      setCurrentPageView(target);
  }

  async function modalChange(target: ModalView | PageView)
  {
    setViewModal(true);
    let confirmChange = true;

    if (target.view == 'MainMenu')
    {
      setAlert(false);
      setSpinner(true);
      setViewModal(false);
  
      if (currentModalView.view == 'Update')
      {
        confirmChange = await updatePDF();
      }
      else if (currentModalView.view == 'Delete')
      {
        confirmChange = await deletePDF();
      }

      if(confirmChange)
        await setCurrentPageView({view: 'MainMenu'});
      return;
    }

    setCurrentModalView(target as ModalView);
  }

  async function handlePDFActionSelect(event: SelectChangeEvent<unknown>)
  {
    console.log(event);
    if (event && event.target && event.target.value == 1)
    {
      console.log(event.target.value);
      setPDFActionSelectValue(0);
      await modalChange({view: 'Update'});
    }

    else if (event && event.target && event.target.value == 2)
    {
      console.log(event.target.value);
      setPDFActionSelectValue(0);
      await modalChange({view: 'Delete'});
    }
  }

  return (
    <div className='PDFPage'>
      {AlertBox(alert, setAlert, alertMessage, alertStatus)}

      {spinner && <FullPageLoader/>}

      {currentPageView.view == 'MainMenu' && <div className='MainMenu'>
        <Button variant='outlined' startIcon={<FileUpload />} onClick={() => pageChange({view: 'ReviewList'})}
          sx={{
            position: 'absolute',
            top: '30%',
            left: '8%',
            marginTop: '-50px',
            marginLeft: '-50px',
            width: '23%',
            height: '23%',
            fontSize: '100%',
            backgroundColor: '#FFC947'
          }}
        >
          Review it
        </Button>

        <Button variant='outlined' startIcon={<AddIcon/>} onClick={() => pageChange({view: 'BlankForms'})}
          sx={{
            position: 'absolute',
            top: '30%',
            left: '42%',
            marginTop: '-50px',
            marginLeft: '-50px',
            width: '23%',
            height: '23%',
            fontSize: '100%',
            backgroundColor: '#FFC947'
          }}
        >
          Request it
        </Button>

        <Button variant='outlined' startIcon={<ViewAgendaIcon/>} onClick={() => pageChange({view: 'ReportList'})}
          sx={{
            position: 'absolute',
            top: '30%',
            left: '75%',
            marginTop: '-50px',
            marginLeft: '-50px',
            width: '23%',
            height: '23%',
            fontSize: '100%',
            backgroundColor: '#FFC947'
          }}
        >
          Report it
        </Button>
      </div>}

      {currentPageView.view == 'ReviewList' && <div className='UserFormListView'>
        <Button onClick={() => modalChange({view: 'UserFormListHelp'})}>Open Help Menu</Button>
        <CustomModal open={viewModal} setOpen={setViewModal}>
          <p>This is help button screen</p>
        </CustomModal>
        <RenderExpandCellGrid 
          columns = {FormListDataGridCols} 
          rows = {DataGridRows}
          pageSize={5}
          rowsPerPageOptions={[5]}
          onSelectionModelChange={(newSelection => {
            setSelectionModel(newSelection);
          })}
          selectionModel={selectionModel}
          columnVisibilityModel={{
            id: false,
          }}
        />
        <Button onClick={() => pageChange({view: 'PDF'})}
          sx={{
            height: 70,
            width: '100%',
            backgroundColor: '#FFC947',
            fontSize: '100%',
          }}
        >
          Submit</Button>
      </div>}

      {currentPageView.view == 'ReviewPDF' && <div className='PDFview'>
        <Button className='PDFViewMenu' onClick={() => modalChange({view: 'UserFormListHelp'})}>Open Help Menu</Button>
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
          <MenuItem value={1}>Update Review Status</MenuItem>
          <MenuItem value={2}>Update Comment</MenuItem>
        </Select>
        { currentModalView.view == 'UpdateStatus' && <CustomModal open={viewModal} setOpen={setViewModal}>
          <div>
            <p className='PDFViewMenu'>Please select a file from your computer to replace the current file.<br/></p>
            <Input inputRef = {PDFActionInputRef} type='file'/> 
            <p className='PDFViewMenu'><br/>Press Submit Button to confirm.</p>
            <Button className='PDFViewMenu' onClick={() => modalChange({view: 'MainMenu'})}>Submit</Button>
          </div>
        </CustomModal>}
        { currentModalView.view == 'UpdateComment' && <CustomModal open={viewModal} setOpen={setViewModal}>
          <div>
            <p className='PDFViewMenu'><br/>Press Submit Button to confirm.</p>
            <Button className='PDFViewMenu' onClick={() => modalChange({view: 'MainMenu'})}>Submit</Button>
          </div>
        </CustomModal>}
        <iframe src={PDFiframeSrc} style={iframeStyle}></iframe>
      </div>}

      {currentPageView.view == 'ReportList' && <div className='UserFormListView'>

        {currentModalView.view == 'ReportListHelp' && <CustomModal open={viewModal} setOpen={setViewModal}>
          <p>This is help button screen</p>
        </CustomModal>}

        {currentModalView.view == 'Upload' && <div className='UploadView'>
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
                  const newProps = {
                    data: {data: UploadFormExtraData, setData: setUploadFormExtraData}, 
                    form: {formType: event.target.value as FormType['formType']}, 
                    functionName: 'UploadSection',
                  };
                  setFormComponent(<GetFormComponent {...newProps}/>);
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
              {/*<GetFormComponent data={{data: UploadFormExtraData, setData: setUploadFormExtraData}} form={formType} functionName='UploadSection'/>*/}
              {FormComponent}

              <p><br/><br/>Please select the form from your computer to upload.<br/></p>
              <Input type='file' inputRef = {UploadInputRef}/>
              <Button onClick={uploadPDF}><br/>Submit</Button>
            </div>
          </CustomModal>
        </div>}
        
        <Button onClick={() => modalChange({view: 'ReportListHelp'})}>Open Help Menu</Button>
        <Button onClick={() => modalChange({view: 'Upload'})}>Submit a form</Button>
        
        <Typography variant="h4" component="div" gutterBottom sx={{
          textAlign: 'center',
        }}>
          Submitted Forms
        </Typography>

        <RenderExpandCellGrid 
          columns = {FormListDataGridCols} 
          rows = {DataGridRows}
          pageSize={5}
          rowsPerPageOptions={[5]}
          onSelectionModelChange={(newSelection => {
            setSelectionModel(newSelection);
          })}
          selectionModel={selectionModel}
          columnVisibilityModel={{
            id: false,
          }}
        />
        <Button onClick={() => pageChange({view: 'PDF'})}
          sx={{
            height: 70,
            width: '100%',
            backgroundColor: '#FFC947',
            fontSize: '100%',
          }}
        >
          Submit</Button>
      </div>}

      {currentPageView.view == 'BlankForms' && <div className='BlankFormsView'>
        <RenderExpandCellGrid 
          columns = {BlankFormListDataGridCols} 
          rows = {DataGridRows}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(newSelection => {
            setSelectionModel(newSelection);
          })}
          selectionModel={selectionModel}
        />
        <Button onClick={() => { getBlankPDFs(); setCurrentPageView({view: 'PDF'}); }}>Submit</Button>
      </div>}

      {currentPageView.view == 'UserFormList' && <div className='UserFormListView'>
        <Button onClick={() => modalChange({view: 'UserFormListHelp'})}>Open Help Menu</Button>
        <CustomModal open={viewModal} setOpen={setViewModal}>
          <p>This is help button screen</p>
        </CustomModal>
        <RenderExpandCellGrid 
          columns = {FormListDataGridCols} 
          rows = {DataGridRows}
          pageSize={5}
          rowsPerPageOptions={[5]}
          onSelectionModelChange={(newSelection => {
            setSelectionModel(newSelection);
          })}
          selectionModel={selectionModel}
          columnVisibilityModel={{
            id: false,
          }}
        />
        <Button onClick={() => pageChange({view: 'PDF'})}
          sx={{
            height: 70,
            width: '100%',
            backgroundColor: '#FFC947',
            fontSize: '100%',
          }}
        >
          Submit</Button>
      </div>}

      {currentPageView.view == 'PDF' && <div className='PDFview'>
        <Button className='PDFViewMenu' onClick={() => modalChange({view: 'UserFormListHelp'})}>Open Help Menu</Button>
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
        </Select>
        { currentModalView.view == 'Update' && <CustomModal open={viewModal} setOpen={setViewModal}>
          <div>
            <p className='PDFViewMenu'>Please select a file from your computer to replace the current file.<br/></p>
            <Input inputRef = {PDFActionInputRef} type='file'/> 
            <p className='PDFViewMenu'><br/>Press Submit Button to confirm.</p>
            <Button className='PDFViewMenu' onClick={() => modalChange({view: 'MainMenu'})}>Submit</Button>
          </div>
        </CustomModal>}
        { currentModalView.view == 'Delete' && <CustomModal open={viewModal} setOpen={setViewModal}>
          <div>
            <p className='PDFViewMenu'><br/>Press Submit Button to confirm.</p>
            <Button className='PDFViewMenu' onClick={() => modalChange({view: 'MainMenu'})}>Submit</Button>
          </div>
        </CustomModal>}
        <iframe src={PDFiframeSrc} style={iframeStyle}></iframe>
      </div>}

    </div>
  );
};

export default PDFPage;