import React, { Component } from 'react';
import Context from '../context/context';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

class HomePage extends Component
{
    static contextType = Context;

    // creates references to be used anywhere in this class
    constructor(props) {
        super(props);
    }

    submitHandler = (event) => 
    {
        // prevents submit button to reload page
        event.preventDefault();
        this.context.logout();
    }

    render ()
    {
        return (
            <header>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
                <div className="home-page">
                    <h1>{this.context.var1}</h1>
                    <Form className = "login-form" onSubmit={this.submitHandler}>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                
                </Form>
                </div>
            </header>
        );
    }
}

export default HomePage;