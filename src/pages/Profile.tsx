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
  branch: string;
  commander: boolean;
  description: string;
  dod: number | string;
  email: string;
  grade: number | string;
  level: number | string;
  name: string;
  phone: string;
  rank: string;
  signature: string;
  superior: number | string;
  // uid: string;
  userStatus: number | string;
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
    branch: '',
    commander: true,
    description: '',
    dod: '',
    email: '',
    grade: '',
    level: '',
    name: '',
    phone: '',
    rank: '',
    signature: '',
    superior: '',
    // uid: '',
    userStatus: '',
  });

  function get_user_test(){
    getUser()
      .then((data) => {
        console.log(data);
        // const userName = (data as any).display_name;
        // console.log('name: ' + userName);
        const userData: userInformation = {
          branch: (data as any).branch,
          commander:(data as any).commander,
          description: (data as any).description,
          dod: (data as any).dod,
          email: (data as any).email,
          grade: (data as any).grade,
          level: (data as any).level,
          name: (data as any).name,
          phone: (data as any).phone,
          rank: (data as any).rank,
          signature: (data as any).signature,
          superior: (data as any).superior,
          // uid: (data as any).uid,
          userStatus: (data as any).user_status,
        };
        console.log('User Email: ' + userData.email);
        console.log('User name: ' + userData.name);
        console.log('User status: ' + userData.userStatus);
        setUserInfo(userData);
        // console.log('User signature: ' + userData.signature);
        // modifyPdf(userData.signature);
        
        // renderNameContent(userName);
        // return(
        //   // <>
        //   //   <h1 className="username-display">{'super test: ' + userData.name}</h1>
        //   // </>
        //   // userData
        // );
         
      }) 
      .catch((error) => {
        console.log('didnt work! :)');
      });
  }

  useEffect(()=>{
    get_user_test();
    console.log('firing everytime :)');
  },[]);

  return (
    <header>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
      <link rel="stylesheet" href="Profile.css" />
      <div className="profile-page">
        <h1 className="username-display">{context.var1}</h1>
        {/* {'test' + get_user_test()} */}
        {/* <h1 className="username-display">{get_user_test}</h1> */}
        
        { Object.keys(userInfo).map((key) => 
        { if ((key as string) == 'commander' && ((userInfo as { [key: string]: any })[key] as unknown as boolean) == true){
          return(<h2 className='username-display' key={'commander'}>commander</h2>);
        }
        else if((key as string) == 'signature'){
          return(<iframe src={(userInfo as { [key: string]: any })[key]} style={iframeStyle}></iframe>);
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

  
  // async function modifyPdf(userData:any) {
  //   const url = 'data:image/png;base64,'+userData;
  //   const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
  
  //   const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
  //   const pages = pdfDoc.getPages();
  // }
  
  
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

// function renderNameContent(userName:any) {
//   return (
//     <>
//       <h1>{userName}</h1>
//     </>
//   );
// }
// async function fuck(){
//   const account = await getUser();
//   const data = {
//     description: account.description,
//     display_name: account.display_name,
//     phone: account.phone,
//     email: account.email
//   };
// }

 