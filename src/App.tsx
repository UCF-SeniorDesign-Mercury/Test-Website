import './App.css';
import React, {SetStateAction, useState } from 'react';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';

import Context from './context/MainContext';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import PDFPage from './pages/PDF';

const App = function (): JSX.Element {
  // keeps track of id and token in the website
  const [var1, setVar1] = useState(null);
  const [var2, setVar2] = useState('this is var 2');

  const login = (value: SetStateAction<null>) => {
    setVar1(value);
    setVar2('this is var 2');
  };

  const logout = () => {
    setVar1(null);
  };

  // AuthContext.Provider allows userId, token, login, and logout to be shared with child components
  return (
    <BrowserRouter>
      <>
        <Context.Provider
          value={{
            var1,
            var2,
            login: login as any,
            logout,
          }}
        >
          <main className="main-content">
            <Switch>
              {!var1 && <Redirect from="/" to="/login" exact />}
              {var1 && <Redirect from="/login" to="/home" exact />}
              {!var1 && <Redirect from="/home" to="/login" exact />}
              {!var1 && <Route path="/login" component={LoginPage} />}
              {var1 && <Route path="/home" component={HomePage} />}
              {var1 && <Route path="/pdf" component={PDFPage} />}
            </Switch>
          </main>
        </Context.Provider>
      </>
    </BrowserRouter>
  );
};

export default App;
