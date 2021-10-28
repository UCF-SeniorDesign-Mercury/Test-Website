import React, { Component, useState} from 'react';
import './Login.css';
import Context from '../context/context';
import { NavLink } from 'react-router-dom';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as ReactBootStrap from "react-bootstrap";

class LoginPage extends Component
{      

    // allows for use of AuthContext outside of render function
    static contextType = Context;
    
    // creates references for login and password fields to be used anywhere in this class
    constructor(props) {
        super(props);
        this.loginEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    // function executes when submit button is pressed
    submitHandler = (event) => 
    {
        // prevents submit button to reload page
        event.preventDefault();

        const login = this.loginEl.current.value;
        this.context.login(login);
    }

    render ()
    {
        
        return (
            
            <div className = "div-background">
                <div class="header">
                    <h1>Welcome to Swype!</h1>
                </div>        
                <Form className = "login-form" onSubmit={this.submitHandler}>
                <Form.Group className="mb-3" controlId="login">
                    <Form.Label>Login</Form.Label>
                    <Form.Control type="text" placeholder="Username" id="login" ref={this.loginEl} required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" id="password" ref={this.passwordEl} required/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                
                </Form>
            </div>


        );
    }
}

export default LoginPage;