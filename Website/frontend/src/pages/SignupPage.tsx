import NavBar from '../components/NavBar.tsx';
import logo from '../assets/testlogo.png'
import Signup from '../components/Signup.tsx';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();

  function navLogin()
  {
    navigate('/login');
  }

  return (
    <div className="mt-10 flex flex-col">
      <NavBar />
      <div className="flex flex-col justify-center w-180 shrink-1 items-center flex-grow overflow-y-auto">
        <div className="bg-black/80 rounded-lg border border-[#6d91e8] max-w-md w-full">
          <img
            className="h-[7vh]  w-auto mx-auto mt-4 mb-4"
            src={logo}
            alt="Logo"
          />
          <Signup />
        </div>
        <div className="mt-4 flex justify-center bg-black/60 rounded-lg border border-[#6d91e8] p-1">
          <p className="text-white">Have an account?</p>
          <button
            className="p-0 bg-transparent border-none ml-2 text-[#6d91e8] hover:text-[#bdc8e2] text-sm font-bold cursor-pointer"
            onClick={navLogin}
          >
            Log in.
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
