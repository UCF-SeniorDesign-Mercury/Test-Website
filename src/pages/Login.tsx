import React, { useContext, } from 'react';

import './Login.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import mainContext from '../context/MainContext';
import 'bootstrap/dist/css/bootstrap.min.css';

import armyLogo from '../assets/1200px-Seal_of_the_United_States_Army_Reserve.svg.png';

const LoginPage = function (): JSX.Element {
  const context = useContext(mainContext);
  const loginEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const passwordEl: React.MutableRefObject<null> = React.useRef(null);

  function SubmitHandler(event: React.FormEvent<HTMLFormElement>): void {
    // prevents submit button to reload page
    event.preventDefault();
    if (loginEl && loginEl.current) {
      const login: string = loginEl.current.value;
      if (context && context.login)
        context.login(login);
    }
  }

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
