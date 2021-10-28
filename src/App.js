import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Context from './context/context';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';

class App extends Component {

  //keeps track of id and token in the website
  state = {
    var1: null,
    var2: "this is var 2"
  }

  login = (value) => {
    this.setState({ var1: value});
  };

  logout = () => {
    this.setState({ var1: null });
  };

  // AuthContext.Provider allows userId, token, login, and logout to be shared with child components
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Context.Provider 
              value = {{
                var1: this.state.var1, 
                var2: this.state.var2, 
                login: this.login, 
                logout: this.logout
              }}>
          <main className="main-content">
            <Switch>
              {!this.state.var1 && <Redirect from='/' to='/login' exact/>}
              {this.state.var1 && <Redirect from='/login' to='/home' exact/>}
              {!this.state.var1 && <Redirect from='/home' to='/login' exact/>}
              {!this.state.var1 && <Route path='/login' component={LoginPage}/>}
              {this.state.var1 && <Route path='/home' component={HomePage}/>}
            </Switch>
          </main>
          </Context.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
