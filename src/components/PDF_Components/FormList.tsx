import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { PDFDocument } from 'pdf-lib';

import { useEffect, useState } from 'react';
import { getRecommendationFiles, getUserFiles, reviewUserFiles } from '../../api/files';
import { getUser, getUsers } from '../../api/users';

import { PageView } from '../../pages/PDF';
import { CustomModal } from '../Modal';
import { RenderExpandCellGrid } from '../RenderExpandCellGrid';
import Upload from './Upload';

interface ModalView
{
  view: 'Nothing'
  | 'Upload'
  | 'ReportListHelp';
}

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


const FormListPage: React.FC<{
  viewModal: boolean;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>; 
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setAlertStatus: React.Dispatch<React.SetStateAction<string>>;
  pageChange: (target: PageView, inputFileID?: string, previousPage?: PageView) => void;
  currentPageView: PageView;
}> = (props: {
  viewModal: boolean;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSpinner: React.Dispatch<React.SetStateAction<boolean>>; 
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setAlertStatus: React.Dispatch<React.SetStateAction<string>>;
  pageChange: (target: PageView, inputFileID?: string, previousPage?: PageView) => void;
  currentPageView: PageView;
}) => {

  const [DataGridRows, setDataGridRows] = useState<FormListDataGridRowsType[] | BlankFormListDataGridRowsType[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const [viewModal, setViewModal] = [props.viewModal, props.setViewModal];
  const [currentModalView, setCurrentModalView] = useState<ModalView>({view: 'Nothing'});
  const pageChange = props.pageChange;
  const currentPageView = props.currentPageView;
  
  const setSpinner = props.setSpinner;
  const setAlert = props.setAlert;
  const setAlertMessage = props.setAlertMessage;
  const setAlertStatus = props.setAlertStatus;

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
    //setPDFiframeSrc(pdfDataUri);
  }

  async function getReviewUserPDFs():Promise<boolean> 
  {
    setAlert(false);
    setSpinner(true);

    let fileData: FormListDataGridRowsType[] | BlankFormListDataGridRowsType[] = [];

    await reviewUserFiles()
      .then(async (data) => {
        let i: number;  
        for (i = 0; i < (data as any[]).length; i++)
        {
          await getUsers('uid='+(data as any[])[i].author)
            .then((userData) => {
              (data as any[])[i].author = (userData as any[])[0].name;
            });

          await getUsers('dod='+(data as any[])[i].reviewer)
            .then((userData) => {
              (data as any[])[i].reviewer = (userData as any[])[0].name;
            });
        }
        fileData = fileData.concat(data as FormListDataGridRowsType[]);
      })
      .catch((error) => {
        pageChange({view: 'MainMenu'});
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
        return false;
      });
    
    await getRecommendationFiles()
      .then(async (data) => {
        let i: number;  
        for (i = 0; i < (data as any[]).length; i++)
        {

          await getUsers('uid='+(data as any[])[i].author)
            .then((userData) => {
              (data as any[])[i].author = (userData as any[])[0].name;
            });

          await getUsers('dod='+(data as any[])[i].reviewer)
            .then((userData) => {
              (data as any[])[i].reviewer = (userData as any[])[0].name;
            });
        }
        fileData = fileData.concat(data as FormListDataGridRowsType[]);
      })
      .catch((error) => {
        pageChange({view: 'MainMenu'});
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
        return false;
      });
      
    setDataGridRows(fileData as FormListDataGridRowsType[]);


    setSpinner(false);
    return true;
  }

  async function getUserPDFs():Promise<boolean> 
  {
    setAlert(false);
    setSpinner(true);
    await getUserFiles()
      .then(async (data) => {
        let i = 0;
        // eslint-disable-next-line
        for (i = 0; i < (data as any[]).length; i++)
        {

          (data as any[])[i].timestamp = (new Date((data as any[])[i].timestamp)).toLocaleString();

          // eslint-disable-next-line
          if (!(data as any[])[i].reviewer_visible)
          {
            // eslint-disable-next-line
            (data as any[])[i].reviewer = (data as any[])[i].recommender;
          }

          await getUsers('uid='+(data as any[])[i].author)
            .then((userData) => {
              (data as any[])[i].author = (userData as any[])[0].name;
            });

          await getUsers('dod='+(data as any[])[i].reviewer)
            .then((userData) => {
              (data as any[])[i].reviewer = (userData as any[])[0].name;
            });
        }
        setDataGridRows(data as FormListDataGridRowsType[]);
      })
      .catch((error) => {
        pageChange({view: 'MainMenu'});
        setAlertMessage(error);
        setAlertStatus('error');
        setAlert(true);
        return false;
      });
    setSpinner(false);
    return true;
  }

  useEffect(() => {
    if (currentPageView.view == 'ReviewList')
      getReviewUserPDFs()
        .catch((err) => console.log(err));
    else if (currentPageView.view == 'ReportList')
      getUserPDFs()
        .catch((err) => console.log(err));
    else if (currentPageView.view == 'BlankForms')
      setDataGridRows([{id: '1', filename: 'RST'}]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(<div>

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
      <Button onClick={() => { getBlankPDFs(); pageChange({view: 'PDF'}); }}>Submit</Button>
    </div>}

    {currentModalView.view == 'ReportListHelp' && <CustomModal open={viewModal} setOpen={setViewModal}>
      <p>This is help button screen</p>
    </CustomModal>}

    {currentModalView.view == 'Upload' && <div className='UploadView'>

      <Upload 
        viewModal={viewModal}
        setViewModal={setViewModal}
        setSpinner={setSpinner}
        setAlert={setAlert}
        setAlertMessage={setAlertMessage}
        setAlertStatus={setAlertStatus}
        pageChange={pageChange}
      />
    </div>}
    
    <Button onClick={() => {pageChange({view: 'MainMenu'});}}>Go Back</Button>
    <Button onClick={() => {setViewModal(true); setCurrentModalView({view: 'ReportListHelp'});}}>Open Help Menu</Button>
    {currentPageView.view == 'ReportList' && <Button onClick={() => {setViewModal(true); setCurrentModalView({view: 'Upload'});}}>Submit a form</Button>}
    
    <Typography variant="h4" component="div" gutterBottom sx={{
      textAlign: 'center',
    }}>
      {currentPageView.view == 'ReviewList' && 'Review Forms' }
      {currentPageView.view == 'ReportList' && 'Submitted Forms' }
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
    <Button onClick={() => {
      if (selectionModel.length == 0)
      {
        setAlertMessage('Please select a file to view.');
        setAlertStatus('error');
        setAlert(true);
        return;
      }
      pageChange({view: 'PDF'}, selectionModel[0] as string, currentPageView);
    }}
    sx={{
      height: 70,
      width: '100%',
      backgroundColor: '#FFC947',
      fontSize: '100%',
    }}
    >
      Submit</Button>
  </div>);
};

export default FormListPage;