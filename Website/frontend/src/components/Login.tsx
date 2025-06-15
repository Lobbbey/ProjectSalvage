import show from '../assets/eye-password-show.png'
import dontshow from '../assets/eye-password-hide.png'
import { useNavigate } from 'react-router-dom';
import {useState} from 'react'

function Login() {
  const navigate = useNavigate();

  const [showPasssword, setShowPassword] = useState(false);

  async function doLogin(event:any) : Promise<void>
  {
    const loginVal = (document.getElementById("loginName") as HTMLInputElement).value;
    const passVal = (document.getElementById("loginPassword") as HTMLInputElement).value;
    const alertMessage = document.getElementById("alertmessage");

    if (alertMessage){ 


      if (loginVal.length == 0 && passVal.length == 0)
      { 
        alertMessage.innerText = "Username and Password are both empty!";
        alertMessage.style.visibility = "visible";
        return;
      } 
      else if (loginVal.length != 0 && passVal.length == 0)
      {
        alertMessage.innerText = "Password is empty!";
        alertMessage.style.visibility = "visible";
        return;
      } 
      else if (loginVal.length == 0 && passVal.length != 0)
      {
        alertMessage.innerText = "Username is empty!";
        alertMessage.style.visibility = "visible"; 
        return;    
      } 

      alertMessage.style.visibility = "hidden";

      // Add api call here
      var loginName = "";
      var loginPassword = ""
      
      loginName = loginVal;
      loginPassword = passVal;
      event.preventDefault();
      var obj = {Email:loginName,Password:loginPassword};
      var js = JSON.stringify(obj);
      try
      {
        const response = await fetch('http://salvagefinancial.xyz:5000/api/login',
        {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
        var res = JSON.parse(await response.text());
        if(res.IfFound == 0)
        {
          alertMessage.innerText = 'User/Password combination incorrect';
          alertMessage.style.visibility = "visible"; 
        }
        else
        {
          localStorage.setItem('user_data', JSON.stringify(res));
          alertMessage.style.visibility = "hidden";

          await setInfo();

          const data = localStorage.getItem('user_data');
          const parsedData = data ? JSON.parse(data) : null;

          if(parsedData.User.InitialAmount == undefined)
            navOnboard();
          else
            navDashboard();
        }
      }
      catch(error:any)
      {
          alert(error.toString());
          return;
      }
    }
    
  }

  async function setInfo() : Promise<void>
  {
    const data = localStorage.getItem('user_data');
    const parsedData = data ? JSON.parse(data) : null;
    //console.log(parsedData.token);
    localStorage.setItem('token', parsedData.token);
    //var obj = {token:parsedData.token};
    //var js = JSON.stringify(obj);
    try
    {
      const response = await fetch('http://salvagefinancial.xyz:5000/api/ShowAllInfo',
      {method:'POST', headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${parsedData.token}`}});
      var res = JSON.parse(await response.text());
      if( res.Result == "invalid token")
      {
        console.log("FAILED IN SETINFO FUNCTION");
      }
      else
      {
        //console.log(JSON.stringify(res));
        localStorage.setItem('user_data', JSON.stringify(res));
      }
    }
    catch(error:any)
    {
        alert(error.toString());
        return;
    }
  }

  function navForgotPassword()
  {
    navigate('/forgot');
  }

  function navDashboard()
  {
    navigate('/dashboard');
  }

  function navOnboard()
  {
    navigate('/onboard');
  }

  function showPasswordHandler()
  {
    setShowPassword(!showPasssword);
  }

  return(
    <div className="flex flex-col items-center" id="loginDiv">
      <span className="font-[Lucida Sans] font-bold text-[3vh] text-[#6d91e8]">LOG IN</span><br />

      <h5 className="self-start ml-[10%] text-lg text-white">Email</h5>
      <input className = "w-8/10 text-lg text-white  rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1"
      type="text" id="loginName" placeholder="Email" onKeyUp={(e) => {
        if (e.key === "Enter") 
        {
          var passwordInput = document.getElementById("loginPassword") as HTMLInputElement;
          passwordInput.focus();
        }
      }}/><br />

      <div className="flex w-[100%] justify-between">
      <h5 className="ml-[10%] text-lg text-white">Password</h5>
      <button className="mr-[10%] p-0 border-none text-[#6d91e8] hover:text-[#bdc8e2] text-xs font-bold cursor-pointer" onClick={navForgotPassword}>Forgot Password?</button>
      </div>

      <div className="flex w-[100%] relative items-center">
        <input className = "w-8/10 text-lg text-white ml-[10%] rounded-sm border border-[#6d91e8] relative bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1"
        type= { showPasssword ? "text" :"password"} id="loginPassword" placeholder="Password" onKeyUp={(e) => {if (e.key === "Enter") {doLogin(e);}}}/>
        <img className="h-[2vh] absolute z-10 ml-[84%] cursor-pointer" onClick={showPasswordHandler} src={showPasssword ? show : dontshow} alt="Show/hide password button"/>
      </div>

      <h5 className="mt-3 text-[#ff6384]" id = "alertmessage"></h5>
      <button className=" rounded-sm inline-block h-fit w-fit p-[3px] pl-[7px] pr-[7px] bg-transparent hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] m-[5%] cursor-pointer" onClick={doLogin}>Login</button>
      <span id="loginResult"></span>
    </div>
  );
}

export default Login;
