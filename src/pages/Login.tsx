import React, { useContext, useState} from 'react';

import './Login.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import mainContext from '../context/MainContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginWithEmail } from '../firebase/firebase';

import armyLogo from '../assets/1200px-Seal_of_the_United_States_Army_Reserve.svg.png';

const LoginPage = function (): JSX.Element {
  const context = useContext(mainContext);
  const loginEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const passwordEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const [headerMessage, setHeaderMessage] = useState('Welcome Back!');

  async function SubmitHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    // prevents submit button to reload page
    event.preventDefault();
    if (loginEl && loginEl.current && passwordEl.current && passwordEl.current) {
      const login: string = loginEl.current.value;
      const password: string = passwordEl.current.value;
      const result = await handleOnLogin(login, password);
      if (result && context && context.login)
        context.login(login);
    }
  }
 
  async function handleOnLogin(email: string, password: string): Promise<boolean | undefined> {
    const result = await loginWithEmail(email, password);
    if (!result){
      setHeaderMessage('Error Cannot Login. Try making an account on firebase.');
    }
    return result;
  }

  return (
    <div className="div-background">
      <div className="login-header">
        <h1 className="headerText">{headerMessage}</h1>
        <img className="login-img" src={armyLogo}/>
      </div>
      <Form className="login-form" onSubmit={SubmitHandler}>
        <Form.Group className="mb-3" controlId="login">
          <Form.Control
            className="login-form-control"
            type="text"
            placeholder="Email"
            ref={loginEl}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Control
            className="login-form-control"
            type="password"
            placeholder="Password"
            ref={passwordEl}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>

      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default LoginPage;
