import PageTitle from '../components/PageTitle.tsx';
import logo from '../assets/testlogo.png'
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

  function navDashboardPage()
  {
    if(location.pathname != '/dashboard')
      navigate('/dashboard');
  }

  function navFinancialsPage()
  {
    if(location.pathname != '/financials')
      navigate('/financials');
  }

  function navDebtPage()
  {
    if(location.pathname != '/debt')
      navigate('/debt');
  }

  function navSavingsPage()
  {
    if(location.pathname != '/savings')
      navigate('/savings');
  }

  // See duplicate in pagetitle
  function doLogout()
  {
    // Add more here to actually log user out
    localStorage.clear();
    navHome();
  }
  
  // Not logged in
  if(localStorage.getItem('user_data') == null)
    return (
    <div className="flex h-[6.5vh] max-w-screen w-screen bg-black/60 fixed top-0 left-0 border-b border-[#6d91e8] items-center justify-between shrink-1">
      <div className="flex items-center">
          <img className="h-[5vh] w-auto cursor-pointer" src={logo} onClick={doLogout} alt="Anchor"/>
          <PageTitle />
      </div>
      <div className="flex items-center">
          <button className="rounded-sm inline-block h-fit w-fit p-[3px] pl-[7px] pr-[7px] bg-transparent hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] mr-4 cursor-pointer" onClick={navLogin}>Login</button>
          <button className="rounded-sm inline-block h-fit w-fit p-[3px] pl-[7px] pr-[7px] bg-transparent hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] mr-6 cursor-pointer" onClick={navSignup}>Signup</button>
      </div>
    </div>
    );
  // Onboarding
  else if(location.pathname == '/onboard')
  {
    return(
    <div className="flex h-[6.5vh] max-w-screen w-screen bg-black/60 fixed top-0 left-0 border-b border-[#6d91e8] items-centershrink-1">
      <div className="flex items-center">
          <img className="h-[5vh] w-auto cursor-pointer" src={logo} onClick={doLogout} alt="Anchor"/>
          <PageTitle />
      </div>
    </div>
    );
  }
  // Logged in
  else
  {
    const data = localStorage.getItem('user_data');
    const parsedData = data ? JSON.parse(data) : null;
    //const parsedData = {User:{FName:"joe", LName:"bob"}};
    return (
      <div className="flex h-[6.5vh] max-w-screen w-screen whitespace-nowrap bg-black/80 fixed top-0 left-0 z-10 border-b border-[#6d91e8] items-center justify-between shrink-1">
        <div className="flex items-center">
            <img className="h-[5vh] w-auto cursor-pointer" src={logo} onClick={doLogout} alt="Anchor"/>
            <PageTitle />
        

          <button className={`ml-6 p-1 border-r border-l text-white border-[#6d91e8] hover:border-[#bdc8e2] hover:bg-white/15 cursor-pointer ${location.pathname == '/dashboard' ? 'border-b-3 bg-white/15' : ''}`} onClick={navDashboardPage} 
          >Dashboard</button>
          <button className={`ml-6 p-1 border-r border-l text-white border-[#6d91e8] hover:border-[#bdc8e2] hover:bg-white/15 cursor-pointer ${location.pathname == '/financials' ? 'border-b-3 bg-white/15' : ''}`} onClick={navFinancialsPage}
          >Financials</button>
          <button className={`ml-6 p-1 border-r border-l text-white border-[#6d91e8] hover:border-[#bdc8e2] hover:bg-white/15 cursor-pointe ${location.pathname == '/debt' ? 'border-b-3 bg-white/15' : ''}`} onClick={navDebtPage}
            >Debt</button>
          <button className={`ml-6 p-1 border-r border-l text-white border-[#6d91e8] hover:border-[#bdc8e2] hover:bg-white/15 cursor-pointe ${location.pathname == '/savings' ? 'border-b-3 bg-white/15' : ''}`} onClick={navSavingsPage}
          >Accounts</button>
        </div>
        <div className="flex items-center">
          <h2 className="font-[Lucida Sans] font-bold text-2xl text-[#6d91e8] mr-6"> {parsedData.User.FName} {parsedData.User.LName}</h2>
          <button className="rounded-sm inline-block h-fit w-fit p-[3px] pl-[7px] pr-[7px] bg-transparent hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] mr-6 cursor-pointer" onClick={doLogout}>Log out</button>
        </div>

      </div>);
  }
    
};

export default NavBar;
