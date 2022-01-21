import React, { useState} from 'react';
import { Redirect } from 'react-router-dom';

import './RegisterNewUser.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { registerWithEmail, verifyEmail, changePassword } from '../firebase/firebase';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AlertBox from '../components/AlertBox';



const ChangePassword = function (): JSX.Element {
  const emailEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const passwordEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [alert, setAlert] = useState(false);
  const [redirect, setRedirect] = useState(false);

  async function SubmitHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    // prevents submit button to reload page
    event.preventDefault();
    setAlert(false);
    setSpinner(true);
    if (emailEl && emailEl.current) {
      const email: string = emailEl.current.value;
      const result = await handleOnChangePassword(email);
      if (result)
      {
        setRedirect(true);
        // change route here
      }
    }
  }
 
  async function handleOnChangePassword(email: string): Promise<boolean | void> {
    const result = await changePassword(email);
    if (!result){
      setAlertMessage('Error Cannot find email. Check email address and try again.');
      setAlert(true);
      setSpinner(false);
    }
    return result;
  }


  return (
    <div className="div-background">
      {redirect && <Redirect to="/login" /> }
      {AlertBox(alert, setAlert, alertMessage)}
      <div className="register-header">
        <h1 className="headerText">Reset Password</h1>
      </div>
      {spinner && <Box sx={{ 
        display: 'flex',
        width: '100%',
        zIndex:1, 
        position: 'absolute', 
        opacity: '80%',
      }}>
        <CircularProgress />
      </Box>}
      <Form className="register-form" onSubmit={SubmitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Control
            className="email-form-control"
            type="text"
            placeholder="Email"
            ref={emailEl}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Reset Password
        </Button>
        <Button variant="primary" type="submit">
          Login
        </Button><Button variant="primary" type="submit">
          Create Account
        </Button>
      </Form>

      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default ChangePassword;
