import mainContext from '../context/MainContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
import { NavLink } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

import React, { useEffect, useState } from 'react';

import { useContext } from 'react';
import { deleteUser,getSubordinates,getUser,getUsers,updateUser} from '../api/users';

const iframeStyle = {
  width: '100%', 
  height: '2000px', 
};
interface userInformation{
  name: string;
  email: string;
  branch: string;
  // commander: boolean;
  // description: string;
  dod: number | string;
  grade: number | string;
  level: number | string;
  officer: boolean | string;
  phone: string;
  rank: string;
  superior: number | string;
  // uid: string;
  // userStatus: number | string;
  // signature: string;
}

function SubmitHandler(event: React.FormEvent<HTMLFormElement>): void {
  const context = useContext(mainContext);
  // prevents submit button to reload page
  event.preventDefault();
  if (context && context.logout)
    context.logout();
}

const ProfilePage = function (): JSX.Element {
  const context = useContext(mainContext);
  // const test = get_user_test();
  // console.log('fuck' +test);
  const [userInfo, setUserInfo] = useState<userInformation>({
    name: '',
    email: '',
    branch: '',
    // commander: true,
    // description: '',
    dod: '',
    grade: '',
    level: '',
    officer: true,
    phone: '',
    rank: '',
    superior: '',
    // uid: '',
    // userStatus: '',
    // signature: '',
  });

  function get_user(){
    getUser()
      .then((data) => {
        console.log(data);
        // const userName = (data as any).display_name;
        // console.log('name: ' + userName);
        const userData: userInformation = {
          name: (data as any).name,
          email: (data as any).email,
          branch: (data as any).branch,
          // commander:(data as any).commander,
          // description: (data as any).description,
          dod: (data as any).dod,
          grade: (data as any).grade,
          level: (data as any).level,
          officer:(data as any).officer,
          phone: (data as any).phone,
          rank: (data as any).rank,
          superior: (data as any).superior,
          // uid: (data as any).uid,
          // userStatus: (data as any).user_status,
          // signature: (data as any).signature,
        };
        setUserInfo(userData);
        // console.log(userData.name + 'testtest');
      }) 
      .catch((error) => {
        console.log('didnt work! :)');
      });
  }

  useEffect(()=>{
    get_user();
  },[]);

  return (
    <header>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
      <link rel="stylesheet" href="Profile.css" />
      <div className="profile-page">
        {/* <h1 className="username-display">{context.var1}</h1> */}
        {/* {'test' + get_user_test()} */}
        {/* <h1 className="username-display">{get_user_test}</h1> */}
        
        { Object.keys(userInfo).map((key) =>{
          if((key as string) == 'name'){
            return(
              <h2 className='username-display' key={key}>Name: {(userInfo as { [key: string]: any })[key]}</h2>  
            );
          }
          else if((key as string) == 'email'){
            return(
              <h2 className='username-display' key={key}>Email: {(userInfo as { [key: string]: any })[key]}</h2>  
            );
          }
          else if((key as string) == 'branch'){
            return(
              <h2 className='username-display' key={key}>Branch: {(userInfo as { [key: string]: any })[key]}</h2>  
            );
          } 
          // else if ((key as string) == 'commander' && ((userInfo as { [key: string]: any })[key] as unknown as boolean) == true){
          //   return(<h2 className='username-display' key={'commander'}>commander</h2>);
          // }
          // else if ((key as string) == 'commander' && ((userInfo as { [key: string]: any })[key] as unknown as boolean) == false){
          //   return(<h2 className='username-display' key={'commander'}>not Commander</h2>);
          // }
          else if((key as string) == 'dod'){
            return(
              <h2 className='username-display' key={key}>DOD: {(userInfo as { [key: string]: any })[key]}</h2>  
            );
          }
          else if((key as string) == 'grade'){
            return(
              <h2 className='username-display' key={key}>Grade: {(userInfo as { [key: string]: any })[key]}</h2>  
            );
          }
          else if((key as string) == 'level'){
            return(
              <h2 className='username-display' key={key}>Level: {(userInfo as { [key: string]: any })[key]}</h2>  
            );
          }
          else if ((key as string) == 'officer' && ((userInfo as { [key: string]: any })[key] as unknown as boolean) == true){
            return(<h2 className='username-display' key={'officer'}>Officer</h2>);
          }
          else if ((key as string) == 'officer' && ((userInfo as { [key: string]: any })[key] as unknown as boolean) == false){
            return(<h2 className='username-display' key={'officer'}>not Officer</h2>);
          }
          
          // else if((key as string) == 'signature'){
          //   return(
          //     <div className='wrap center'>
          //     Signature: <iframe className='frame' scrolling="no" src={(userInfo as { [key: string]: any })[key]}></iframe>
          //     </div>  
          //   );
          // }
          else if((key as string) == 'phone'){
            return(
              <h2 className='username-display' key={key}>Phone: {(userInfo as { [key: string]: any })[key]}</h2>  
            );
          }
          else if((key as string) == 'rank'){
            return(
              <h2 className='username-display' key={key}>Rank: {(userInfo as { [key: string]: any })[key]}</h2>  
            );
          }
          else if((key as string) == 'superior'){
            return(
              <h2 className='username-display' key={key}>Superior: {(userInfo as { [key: string]: any })[key]}</h2>  
            );
          }
          else{
            return(<h2 className='username-display' key={key}>{(userInfo as { [key: string]: any })[key]}</h2>);
          }
        }
        )
        }
        
      </div>
    </header>
  );
  
  
};

export default ProfilePage;



// function get_user_test(){
//   getUser()
//     .then((data) => {
//       console.log(data);
//       console.log((data as any).display_name);
//       const userName = (data as any).display_name;
//       console.log('name: ' + userName);
//       renderNameContent(userName);
//       return userName;
//     }) 
//     .catch((error) => {
//       console.log('didnt work! :)');
//     });
// }

 