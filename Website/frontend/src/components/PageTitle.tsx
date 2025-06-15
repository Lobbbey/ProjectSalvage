import { useNavigate } from 'react-router-dom';

function PageTitle(){
  const navigate = useNavigate();

  function navHome()
  {
    navigate('/')
  }

  function doLogout()
  {
    // Add more here to actually log user out
    localStorage.clear();
    navHome();
  }

  return(<p className="mb-1 font-[Lucida Sans] text-4xl text-[#6d91e8] cursor-pointer" onClick={doLogout}>Salvage Financial</p>);
};

export default PageTitle;
