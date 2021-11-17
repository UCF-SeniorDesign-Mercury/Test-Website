import { useContext } from 'react';
import React from "react";
import './Login.css';
import mainContext from '../context/context';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage(): JSX.Element 
{
    const context = useContext(mainContext);
    const loginEl = React.useRef<HTMLInputElement>(null);
    const passwordEl = React.useRef(null);

    function SubmitHandler (event: React.FormEvent<HTMLFormElement>): void 
    {
        // prevents submit button to reload page
        event.preventDefault();

        if (loginEl && loginEl.current)
        {
            const login = loginEl.current.value;
            // @ts-ignore
            context.login(login);
        }
    }

    return (
            
        <div className = "div-background">
            <div className="header">
                <h1>Electric Eagles</h1>
            </div>        
            <Form className = "login-form" onSubmit={SubmitHandler}>
            <Form.Group className="mb-3" controlId="login">
                <Form.Label>Login</Form.Label>
                <Form.Control type="text" placeholder="Username" id="login" ref={loginEl} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" id="password" ref={passwordEl} required/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            
            </Form>
        </div>

    );
}

export default LoginPage;