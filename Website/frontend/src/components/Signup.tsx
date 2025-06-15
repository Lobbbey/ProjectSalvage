import app from "../pages/App.module.css";
import show from "../assets/eye-password-show.png";
import dontshow from "../assets/eye-password-hide.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import emailjs from 'emailjs-com';

function Signup() {
  const navigate = useNavigate();

  const [isPasswordNumberValid, setIsPasswordNumberValid] = useState(false);
  const [isPasswordSymbolValid, setIsPasswordSymbolValid] = useState(false);
  const [isPasswordLengthValid, setIsPasswordLengthValid] = useState(false);
  const [isPasswordSame, setIsPasswordSame] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showPasssword, setShowPassword] = useState(false);
  const [showConfirmPasssword, setShowConfirmPassword] = useState(false);
  const [stageNum, setStageNum] = useState<number | null>(1)
  const [tempPass, setTempPass] = useState<number | null>(null)
  const [FirstName, setFName] = useState<string>("")
  const [LastName, setLName] = useState<string>("")
  const [Email, setEmail] = useState<string>("")
  const [Password, setPassword] = useState<string>("")


  function showPasswordHandler() {
    setShowPassword(!showPasssword);
  }

  function showConfirmPasswordHandler() {
    setShowConfirmPassword(!showConfirmPasssword);
  }

  function navLoginPage() {
    navigate("/login");
  }

  async function doSignUp(event: any): Promise<void> {
    const FirstName = (document.getElementById("FirstName") as HTMLInputElement)
      .value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement)
      .value;
    const Email = (document.getElementById("Email") as HTMLInputElement).value;
    const Password = (
      document.getElementById("loginPassword") as HTMLInputElement
    ).value;
    const ConfirmPass = (
      document.getElementById("ConfPassword") as HTMLInputElement
    ).value;

    const alertMessage = document.getElementById("alertmessage");


    const serviceID = "service_joh3vl9"; // EmailJS Service ID
    const templateID = "template_i8aabcz"; // EmailJS Template ID
    const publicKey = "SjEKgAnbxGXtlizVm"; // EmailJS Public Key


    if (alertMessage) {
      if (
        FirstName.length == 0 ||
        lastName.length == 0 ||
        Email.length == 0 ||
        Password.length == 0 ||
        ConfirmPass.length == 0
      ) {
        alertMessage.innerText = "One or more fields are missing!";
        alertMessage.style.visibility = "visible";
        return;
      } else if (!validateEmail()) {
        alertMessage.innerText = "Email must be valid.";
        alertMessage.style.visibility = "visible";
        return;
      } else if (!validatePassword()) {
        alertMessage.innerText = "Password must meet the requirements.";
        alertMessage.style.visibility = "visible";
        return;
      } else if (!isPasswordSame) {
        alertMessage.innerText = "Passwords must be the same.";
        alertMessage.style.visibility = "visible";
        return;
      }

      
      
      var emailExists = await verifyEmail(event, Email);

      if (emailExists === 1){
        alertMessage.innerText = "Email already in use";
        alertMessage.style.visibility = "visible";
        return;
      } else {
        alertMessage.style.visibility = "hidden";

        setFName(FirstName);
        setLName(lastName);
        setEmail(Email);
        setPassword(Password);

        var pass = Math.round((Math.random() * 100000));

        if (pass < 10000 && pass >= 1000) {
            pass *= 10;
        } else if (pass < 1000 && pass >= 100){
            pass *=100;
        } else if (pass < 100 && pass >= 10) {
            pass *= 1000;
        } else if (pass < 10 && pass >= 1){
            pass *= 10000;
        } else if (pass === 0){
            pass = 10000;
        }
        const oneTimePassword = pass.toString();
        setTempPass(pass);

         const templateParams = { //parameters for email builder
            toEmail: Email,
            OneTimePass: oneTimePassword
         };

        emailjs.send(serviceID, templateID, templateParams, publicKey)

        setStageNum(2);
      }
      
    }

    event.preventDefault();
  }

  async function verifyEmail(event: any, Email: string) : Promise<number> {

    const userEmail = Email;
    console.log(userEmail);

    event.preventDefault();
    var obj = {Email: userEmail};
    var js = JSON.stringify(obj);

    try {
        const response = await fetch('http://salvagefinancial.xyz:5000/api/IfEmailExists',
        {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
        var res = JSON.parse(await response.text());

        if (res.IfFound == 1){
            console.log(1);
            return 1;
        } else {
            console.log(0);
            return 0;
        }

    } catch (error : any) {
        alert(error.toString());
        return -1;
    }

}



  let symbols = new Set(["!", "@", "#", "$", "%", "^", "&", "*"]);
  let numbers = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

  function validatePassword() {
    validatePasswordSame();

    console.log("validating");
    var password = (
      document.getElementById("loginPassword") as HTMLInputElement
    ).value;
    var symbol = false;
    var number = false;

    for (let i = 0; i < password.length; i++) {
      if (symbols.has(password[i])) symbol = true;
      else if (numbers.has(password[i])) number = true;

      if (symbol && number) break;
    }

    setIsPasswordNumberValid(number);
    setIsPasswordSymbolValid(symbol);
    setIsPasswordLengthValid(password.length > 7);

    return symbol && number && password.length > 7;
  }

  function validatePasswordSame() {
    if (
      (document.getElementById("loginPassword") as HTMLInputElement).value ===
      (document.getElementById("ConfPassword") as HTMLInputElement).value
    )
      setIsPasswordSame(true);
    else setIsPasswordSame(false);
  }

  function validateEmail() {
    const ret = String(
      (document.getElementById("Email") as HTMLInputElement).value
    )
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

    setIsValidEmail(Boolean(ret));

    return isValidEmail;
  }


  async function verifyOneTimePass(event: any) :Promise<void>{

    const oneTimePass = (document.getElementById("loginNames") as HTMLInputElement).value;
    const alertMessage = document.getElementById("alertmessage");

        if (alertMessage){
            if (oneTimePass.length != 5){
                alertMessage.innerText = "Invalid Code";
                alertMessage.style.visibility = "visible";
                return;
            } else {
                var tempNum = parseInt(oneTimePass);

                if (tempNum == tempPass){
                    alertMessage.style.visibility = "hidden";
                } else {
                    alertMessage.innerText = "Incorrect Code";
                    alertMessage.style.visibility = "visible";
                    return;
                }
            }
        }

        event.preventDefault();
        var obj = {
          FName: FirstName,
          LName: LastName,
          Email: Email,
          Password: Password,
        };

        var js = JSON.stringify(obj);
        
        try {
          const response = await fetch(
            "http://salvagefinancial.xyz:5000/api/signup",
            {
              method: "POST",
              body: js,
              headers: { "Content-Type": "application/json" },
            }
          );
          var res = JSON.parse(await response.text());
          if (res.Result == "User Already Exists") {
            if (alertMessage){
              alertMessage.innerText = "User already exists.";
              alertMessage.style.visibility = "visible";
            }
          } else {
            if (alertMessage){
              alertMessage.style.visibility = "hidden";
              navLoginPage();
            }
          }
        } catch (error: any) {
          alert(error.toString());
          return;
        }
    }

    
  if (stageNum == 1){

    return (
      <div className="flex flex-col justify-center w-[100%] h-135 shrink-1 items-center flex-grow" id="loginDiv">
        <span className="font-[Lucida Sans] font-bold text-[3vh] text-[#6d91e8]">SIGN UP</span>
        <h5 className="self-start ml-[10%] mt-3 text-md text-white">First Name</h5>
        <input className="w-8/10 text-md text-white rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" type="text" id="FirstName" placeholder="First Name" onKeyUp={(e) => {
          if (e.key === "Enter") 
          {
            var next = document.getElementById("lastName") as HTMLInputElement;
            next.focus();
          }
        }}/>

        <h5 className="self-start ml-[10%] mt-3 text-md text-white">Last Name</h5>
        <input className="w-8/10 text-md text-white rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" type="text" id="lastName" placeholder="Last Name" onKeyUp={(e) => {
          if (e.key === "Enter") 
          {
            var next = document.getElementById("Email") as HTMLInputElement;
            next.focus();
          }
        }}/>
        <h5 className="self-start ml-[10%] mt-3 text-md text-white">Email</h5>
        <input className="w-8/10 text-md text-white rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" type="text" id="Email" placeholder="Email" onKeyUp={(e) => {
          validateEmail();
          if (e.key === "Enter") 
          {
            var next = document.getElementById("loginPassword") as HTMLInputElement;
            next.focus();
          }
        }}/>
        <h6 className="self-start ml-[10%] text-[#bdc8e2] w-fit text-sm mt-1" id={app.firstinstruction} style={{ color: isValidEmail ? '#36eba6' :'#ff6384' }}>
            {isValidEmail ? "" : "Invalid email."}
        </h6>
        <h5 className="self-start ml-[10%] mt-3 text-md text-white">Password</h5>
  
        <div className="flex w-[100%] relative items-center">
            <input className="w-8/10 text-md text-white ml-[10%] rounded-sm border border-[#6d91e8] relative bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" type={showPasssword ? "text" : "password" } id="loginPassword" placeholder="Password" onKeyUp={(e) => {
              validatePassword();
              if (e.key === "Enter") 
              {
                var next = document.getElementById("ConfPassword") as HTMLInputElement;
                next.focus();
              }
            }}/>
            <img className="h-[2vh] absolute z-10 ml-[84%] cursor-pointer" onClick={showPasswordHandler} src={showPasssword ? show : dontshow} alt="Show/hide password button"/>
        </div>
  
        <div className="flex w-[100%] whitespace-nowrap items-center mt-1">
          <h6 className="ml-[10%] text-[#bdc8e2] w-fit text-sm">Must contain at least&nbsp;</h6>
          <h6 className="text-[#bdc8e2] w-fit text-sm" id={app.passnumber} style = {{color: isPasswordNumberValid ? '#36eba6' :'#ff6384'}}>1 number</h6>
          <h6 className="text-[#bdc8e2] w-fit text-sm">,&nbsp;</h6>
          <h6 className="text-[#bdc8e2] w-fit text-sm" id={app.passsymbol} style = {{color: isPasswordSymbolValid ? '#36eba6' :'#ff6384'}}>1 symbol</h6>
          <h6 className="text-[#bdc8e2] w-fit text-sm">,&nbsp;</h6>
          <h6 className="text-[#bdc8e2] w-fit text-sm" id={app.passlength} style = {{color: isPasswordLengthValid ? '#36eba6' :'#ff6384'}}>length of 8+</h6>
          <h6 className="text-[#bdc8e2] w-fit text-sm">.</h6>
        </div>
  
        <h5 className="self-start ml-[10%] mt-3 text-md text-white">Confirm Password</h5>
        <div className="flex w-[100%] relative items-center">
            <input className="w-8/10 text-md text-white ml-[10%] rounded-sm border border-[#6d91e8] relative bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" type={showConfirmPasssword ? "text" : "password" } id="ConfPassword" placeholder="Confirm Password" onKeyUp={(e) => {validatePasswordSame();  if (e.key === "Enter") {doSignUp(e);}}}/>
            <img className="h-[2vh] absolute z-10 ml-[84%] cursor-pointer" onClick={showConfirmPasswordHandler} src={showConfirmPasssword ? show : dontshow} alt="Show/hide password button"/>
        </div>
        <h6 className="self-start ml-[10%] text-[#bdc8e2] w-fit text-sm mt-1" style={{ color: isPasswordSame ? '#36eba6' :'#ff6384' }}>
            {isPasswordSame ? "" : "Passwords are not the same."}
        </h6>
        <h5 className="mt-3" id="alertmessage"></h5>
        <button className=" rounded-sm inline-block h-fit w-fit p-[3px] pl-[7px] pr-[7px] bg-transparent hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] m-[5%] cursor-pointer" onClick={doSignUp}>Sign Up</button>
    </div>
    );

  } else if (stageNum == 2){
    return(
      <div id = "loginDivs" className="p-10 max-w-[600px] mx-auto">
                <span className = "font-[Lucida Sans] font-bold text-[3vh] text-[#6d91e8]">Verify Email</span><br />
                <h5 className="mt-8 mb-0 ml-[10%] text-white float-left text-[2vh]">Confirm Email</h5>
                <input type="number" id="loginNames" className = "w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" placeholder="5-digit-code" onKeyUp={(e) => e.key === "Enter" && verifyOneTimePass(event)}/><br/>
                <h5 className="mt-3" id = "alertmessage"></h5>
                <button className="mt-5 rounded-sm inline-block bg-transparent h-fit w-fit p-[3px] pl-[7px] pr-[7px] hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] mt-[5%] ml-[5%] cursor-pointer" onClick={verifyOneTimePass}>Confirm</button>
        </div>
    );
  }

  
}

export default Signup;
