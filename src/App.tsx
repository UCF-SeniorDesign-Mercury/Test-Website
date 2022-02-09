import './App.css';
import React, { useState } from 'react';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';

import Context from './context/MainContext';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import PDFPage from './pages/PDF';
import PDF_TestPage from './pages/PDF_Test';
import Menu from './components/Navigation/Menu';
import RegisterNewUserPage from './pages/RegisterNewUser';
import ChangePassword from './pages/ChangePassword';
import ProfilePage from './pages/Profile';
import Calendarpage from './pages/Calendar';

const App = function (): JSX.Element {
  // keeps track of id and token in the website
  const [var1, setVar1] = useState<string | null>(null);
  const [var2, setVar2] = useState('this is var 2');

  const login = (value: string) => {
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
            login,
            logout,
          }}
        >
          <main className="main-content">
            {var1 && <Menu/>} 
            <Switch>
              {!var1 && <Redirect from="/" to="/login" exact />}
              {!var1 && <Redirect from="/logout" to="/login" exact />}
              {var1 && <Redirect from="/login" to="/home" exact />} 
              {!var1 && <Redirect from="/home" to="/login" exact />}
              {!var1 && <Route path="/login" component={LoginPage} />}
              {!var1 && <Route path="/registerNewUser" component={RegisterNewUserPage} />}
              {!var1 && <Route path="/changePassword" component={ChangePassword} />}
              {var1 && <Route path="/home" component={HomePage} />}
              {var1 && <Route path="/profile" component={ProfilePage} />}
              {var1 && <Route path="/calendar" component={Calendarpage} />}
              {var1 && <Route path="/pdf" component={PDFPage} />}
              {var1 && <Route path="/pdf_test" component={PDF_TestPage} />}
            </Switch>
          </main>
        </Context.Provider>
      </>
    </BrowserRouter>
  );
};

export default App;
