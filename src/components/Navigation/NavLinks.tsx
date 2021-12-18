import { NavLink } from 'react-router-dom';
import { useContext } from 'react';

import Context from '../../context/MainContext';

interface NavLinksProps{
  closeMenu: () => void;
}

const NavLinks = (props:NavLinksProps):JSX.Element => {

  const context = useContext(Context);
  return (
    <header className='navLinks'>
      <nav className="links">
        <ul>
          {context.var1 && <li className='regular' onClick={() => {
            if (context && context.logout) {
              context.logout();
              props.closeMenu();
            }
          }}> <NavLink to="/logout">Home</NavLink></li>} 

          {context.var1 && <li className='regular' onClick={() => {
            if (context && context.logout) {
              context.logout();
              props.closeMenu();
            }
          }}> <NavLink to="/logout">Events</NavLink></li>}      

          {context.var1 && <li className='regular' onClick={() => {
            if (context && context.logout) {
              context.logout();
              props.closeMenu();
            }
          }}> <NavLink to="/logout">Chat</NavLink></li>}  

          {context.var1 && <li className='regular' onClick={() => {
            if (context && context.logout) {
              context.logout();
              props.closeMenu();
            }
          }}> <NavLink to="/logout">PDF&apos;s</NavLink></li>}  
          {context.var1 && <li className='regular' onClick={() => {
            if (context && context.logout) {
              context.logout();
              props.closeMenu();
            }
          }}> <NavLink to="/logout">Profile</NavLink></li>}  

          {context.var1 && <li onClick={() => {
            if (context && context.logout) {
              context.logout();
              props.closeMenu();
            }
          }}> <NavLink to="/logout">Notification</NavLink></li>}  

          {context.var1 && <li onClick={() => {
            if (context && context.logout) {
              context.logout();
              props.closeMenu();
            }
          }}> <NavLink to="/logout">Calendar</NavLink></li>}  
          
          {context.var1 && <li onClick={() => {
            if (context && context.logout) {
              context.logout();
              props.closeMenu();
            }
          }}> <NavLink to="/logout">Module</NavLink></li>}                  
        </ul>
      </nav>
    </header>
  );
};

export default NavLinks;