import Login from "../components/Login.tsx";
//import app from "./App.module.css";
import NavBar from "../components/NavBar.tsx";
import logo from "../assets/testlogo.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  function navSignup() {
    navigate("/signup");
  }

  return (
    <div className="mt-10 flex flex-col">
      <NavBar />
      <div className="flex flex-col justify-center w-100 shrink-1 items-center flex-grow">
        <div className="bg-black/80 rounded-lg border border-[#6d91e8] max-w-md w-full">
          <img
            className="h-[7vh]  w-auto mx-auto mt-4 mb-4"
            src={logo}
            alt="Logo"
          />
          <Login />
        </div>
        <div className="mt-4 flex justify-center bg-black/60 rounded-lg border border-[#6d91e8] p-1">
          <p className="text-white ">Don't have an account?</p>
          <button
            className="p-0 bg-transparent border-none ml-2 text-[#6d91e8] hover:text-[#bdc8e2] text-sm font-bold cursor-pointer"
            onClick={navSignup}
          >
            Sign up.
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
