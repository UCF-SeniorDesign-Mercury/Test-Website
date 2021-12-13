import mainContext from '../context/MainContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { NavLink } from 'react-router-dom';

import { useContext } from 'react';

function SubmitHandler(event: any): void {
  const context = useContext(mainContext);

  // prevents submit button to reload page
  event.preventDefault();
  context.logout();
}

const HomePage = function (): JSX.Element {
  const context = useContext(mainContext);
  return (
    <header>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
      <link rel="stylesheet" href="Home.css" />
      <div className="home-page">
        <h1 className="username-display">{context.var1}</h1>

        <Form className="home-form" onSubmit={SubmitHandler}>
          <Button variant="primary" className="module-button" type="submit">
            Events
          </Button>
          <Button variant="primary" className="module-button" type="submit">
            Chat
          </Button>
          <NavLink to="/pdf">
            <Button variant="primary" className="module-button" type="submit">
              PDF's
            </Button>
          </NavLink>
          <Button variant="primary" className="module-button" type="submit">
            Notification
          </Button>
          <Button variant="primary" className="module-button" type="submit">
            Calendar
          </Button>
          <Button variant="primary" className="module-button" type="submit">
            Module
          </Button>
          <Button variant="primary" className="module-button" type="submit">
            Module
          </Button>
          <Button variant="primary" className="module-button" type="submit">
            Test
          </Button>
          <Button variant="primary" className="module-button" type="submit">
            Test
          </Button>
        </Form>
      </div>
    </header>
  );
};

export default HomePage;
