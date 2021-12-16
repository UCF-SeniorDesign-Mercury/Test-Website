import React, { useContext, useEffect } from 'react';

import './Login.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import mainContext from '../context/MainContext';
import useFullPageLoader from '../hooks/useFullPageLoader';
import 'bootstrap/dist/css/bootstrap.min.css';

import armyLogo from '../assets/1200px-Seal_of_the_United_States_Army_Reserve.svg.png';

const LoginPage = function (): JSX.Element {
  const context = useContext(mainContext);
  const loginEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const passwordEl: React.MutableRefObject<null> = React.useRef(null);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  function SubmitHandler(event: React.FormEvent<HTMLFormElement>): void {
    // prevents submit button to reload page
    event.preventDefault();
    if (loginEl && loginEl.current) {
      const login: string = loginEl.current.value;
      // @ts-ignore
      context.login(login);
    }
  }

  const loadingIcon = async (seconds: number) => {
    showLoader();
    await new Promise(resolve => setTimeout(resolve, 1000*seconds));
    hideLoader();
  };
  
  useEffect(() => {
    loadingIcon(5);
  }, [passwordEl]);

  return (
    <div className="div-background">
      <div className="login-header">
        <h1 className="headerText">Welcome Back</h1>
        <img className="login-img" src={armyLogo}/>
      </div>
      <Form className="login-form" onSubmit={SubmitHandler}>
        <Form.Group className="mb-3" controlId="login">
          <Form.Control
            className="login-form-control"
            type="text"
            placeholder="Email"
            id="login"
            ref={loginEl}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Control
            className="login-form-control"
            type="password"
            placeholder="Password"
            id="password"
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
      {loader}
    </div>
  );
};

export default LoginPage;
