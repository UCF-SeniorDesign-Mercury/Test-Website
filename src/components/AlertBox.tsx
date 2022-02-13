
import Alert from '@mui/material/Alert';
import Zoom from '@mui/material/Zoom';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

export default function AlertBox(externalOpen: boolean, externalSetOpen: React.Dispatch<React.SetStateAction<boolean>>, message: string): ReactJSXElement {
  const [open, setOpen] = [externalOpen, externalSetOpen];
  const icon = (<Alert 
    style={{
      zIndex:1, 
      position: 'fixed', 
      width: '100%', 
      top: 0, 
    }} 

    variant='filled'
    severity="error"

    action={
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={() => {
          setOpen(false);
        }}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
    }

    // overrriding default css
    sx={{ 
      mb: 2,
    }}
    
  >{message}</Alert>
  );

  return (<Zoom in={open}>{icon}</Zoom>
  );
}