import { useNavigate } from 'react-router-dom';

function PageTitle(){
  const navigate = useNavigate();

  function navHome()
  {
    navigate('/')
  }

  return(<h1 id="title" onClick={navHome}>Salvage Financial</h1>);
};

export default PageTitle;
