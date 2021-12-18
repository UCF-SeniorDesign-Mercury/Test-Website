import NavLinks from './NavLinks';
import { BiMenu } from 'react-icons/bi';
import { useState } from 'react';
import './Menu.css';

const Menu = ():JSX.Element => {
  const [state, setState] = useState(false);
  return (   
    <div className="Menu">
      <div className="regular-menu">
        <BiMenu className="menu-icon" 
          size='70px' color='black'
          onClick={() => { setState(!state); }}
        />
        <NavLinks closeMenu={ () => {setState(!state);} }/>
      </div>
      <div className="hamburger-menu">
        {state && <NavLinks closeMenu={ () => {setState(!state);} }/>}
      </div>
    </div>
  );
};

export default Menu;