import PageTitle from '../components/PageTitle.tsx';
import logo from '../assets/testlogo.png'
import app from '../pages/App.module.css'
import { useNavigate } from 'react-router-dom';


const NavBar = () => {
  const navigate = useNavigate();

  function navLogin()
  {
    if(location.pathname != '/login')
      navigate('/login'); 
    else
      navigate('/')
  }

  function navSignup()
  {
    if(location.pathname != '/signup')
      navigate('/signup');
    else
      navigate('/')
  }

  function navHome()
  {
    navigate('/')
  }

  function doLogout()
  {
    // Add more here to actually log user out
    navHome();
  }
  // Not logged in
  if(location.pathname == '/' || location.pathname == '/signup' || location.pathname == '/login')
    return (
      <div id = {app.NavBar}>
          <img src = {logo} id = {app.logoimg} onClick={navHome}></img>
          <PageTitle />
          <button className = {app.loginbuttons} id = {app.loginbutton} 
          onClick={navLogin}>Login</button>
          <button className = {app.loginbuttons} id = {app.signupbutton}
          onClick={navSignup}>Signup</button>
      </div>
    );
  // Logged in
  else
    return (
      <div id = {app.NavBar}>
          <img src = {logo} id = {app.logoimg} onClick={navHome}></img>
          <PageTitle />
          <button className = {app.loginbuttons} id = {app.signupbutton} 
          onClick={doLogout}>Log out</button>
          
      </div>
    );
};

export default NavBar;
