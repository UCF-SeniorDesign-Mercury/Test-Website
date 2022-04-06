import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ModalProps } from '@mui/material';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};
const eventStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  maxHeight: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1,
  overflow: 'auto',
};

interface CustomModalProps
{
  setOpen:  React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomModal: React.FC<ModalProps & unknown & CustomModalProps> = props => {

  return (
    <div>
      <Modal
        open={(props as ModalProps).open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <IconButton onClick={() => props.setOpen(false)} size='small' sx={{
              left: '90%',
            }}>
              <CloseIcon />
            </IconButton>
            {props.children}
          </div>
        </Box>
      </Modal>
    </div>
  );
};
export const CustomEventModal: React.FC<ModalProps & unknown & CustomModalProps> = props => {

  return (
    <div>
      <Modal
        open={(props as ModalProps).open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={eventStyle}>
          <div>
            <IconButton onClick={() => props.setOpen(false)} size='small' sx={{
              left: '95%',
            }}>
              <CloseIcon />
            </IconButton>
            {props.children}
          </div>
        </Box>
      </Modal>
    </div>
  );
};