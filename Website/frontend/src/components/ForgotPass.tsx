import app from "../pages/App.module.css";
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import show from "../assets/eye-password-show.png";
import dontshow from "../assets/eye-password-hide.png";
import {useState} from 'react'


function ForgotPass(){

    const navigate = useNavigate();
    const [value, setValue] = useState("");
    const [tempPass, setTempPass] = useState<number | null>(null)
    const [stageNum, setStageNum] = useState<number | null>(1)
    const [email, setEmail] = useState<string>("");
    const [isPasswordNumberValid, setIsPasswordNumberValid] = useState(false);
    const [isPasswordSymbolValid, setIsPasswordSymbolValid] = useState(false);
    const [isPasswordLengthValid, setIsPasswordLengthValid] = useState(false);
    const [isPasswordSame, setIsPasswordSame] = useState(true);
    const [showPasssword, setShowPassword] = useState(false);
    const [showConfirmPasssword, setShowConfirmPassword] = useState(false);

    async function reclaimPass(){

        const Email = (document.getElementById("loginName") as HTMLInputElement).value;
        const alertMessage = document.getElementById("alertmessage");
        const serviceID = "service_joh3vl9"; // EmailJS Service ID
        const templateID = "template_0wir29e"; // EmailJS Template ID
        const publicKey = "SjEKgAnbxGXtlizVm"; // EmailJS Public Key
        //Website: emailjs.com
        //Email: salvagefinancial416@gmail.com
        //Password: COP4331$
        //works for gmail emails only for now, will add more later

        setEmail(Email);

        if (alertMessage) {

            if (Email.length == 0){
                
                alertMessage.innerText = "No Email is entered";
                alertMessage.style.visibility = "visible";
                return;

            } else {
    
                alertMessage.style.visibility = "hidden";
        
                if (validateEmail()){

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

                    setEmail(Email);
                    const val = await verifyEmail(event, Email);
                
                    if (val === 1) {
                        emailjs.send(serviceID, templateID, templateParams, publicKey)
                        setStageNum(2);
                        return;
                    } else {
                        alertMessage.innerText = "Email doesn't exist";
                        alertMessage.style.visibility = "visible";
                        return;
                    }
                } else {

                    alertMessage.innerText = "Invalid Email";
                    alertMessage.style.visibility = "visible";
                    return;
                }
            }

        }

        
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

    function navLogin(){

        navigate('/login');
    }
   
   function validateEmail(){
        return String((document.getElementById("loginName") as HTMLInputElement).value)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
   }

   function verifyOneTimePass(){

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
                    setStageNum(3);
                } else {
                    alertMessage.innerText = "Incorrect Code";
                    alertMessage.style.visibility = "visible";
                    return;
                }
            }
        }
    
    }

    let symbols = new Set(['!', '@', '#', '$', '%', '^', '&', '*']);
    let numbers = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

    function validatePassword()
    {
        validatePasswordSame();
        
        console.log("validating");
        var password = (document.getElementById("firstPass") as HTMLInputElement).value;
        var symbol = false;
        var number = false;

        for(let i = 0; i < password.length; i++)
        {
            if(symbols.has(password[i]))
                symbol = true;
            else if(numbers.has(password[i]))
                number = true;

            if(symbol && number) break;
        }


        setIsPasswordNumberValid(number);
        setIsPasswordSymbolValid(symbol);
        setIsPasswordLengthValid(password.length > 7);

        return symbol && number && password.length > 7;
    }

    function validatePasswordSame()
    {
        if((document.getElementById("firstPass") as HTMLInputElement).value
        === (document.getElementById("secondPass") as HTMLInputElement).value)
        setIsPasswordSame(true);
        else
        setIsPasswordSame(false);
    }

    function showPasswordHandler() {

        setShowPassword(!showPasssword);
    }
    
    function showConfirmPasswordHandler() {

        setShowConfirmPassword(!showConfirmPasssword);
    }

    async function changePassword(event:any) : Promise<void> 
    {
        const FirstPass = (document.getElementById("firstPass") as HTMLInputElement).value;
        const secondPass = (document.getElementById("secondPass") as HTMLInputElement).value;
        const userEmail = email;
        const alertMessage = document.getElementById("alertmessage");

        if (alertMessage){

            if (FirstPass.length == 0 || secondPass.length == 0) {
                alertMessage.innerText = "One or more fields are missing!";
                alertMessage.style.visibility = "visible";
                return;
            } else if (!validatePassword()) {
                alertMessage.innerText = "Password must meet the requirements.";
                alertMessage.style.visibility = "visible";
                return;
            } else if (!isPasswordSame){
                alertMessage.innerText = "Passwords must be the same.";
                alertMessage.style.visibility = "visible";
                return;
            } else {
                alertMessage.style.visibility = "hidden";
            }

            event.preventDefault();
            var obj = { Email:userEmail, NewPassword:FirstPass};
            var js = JSON.stringify(obj);

            try {
                const response = await fetch('http://salvagefinancial.xyz:5000/api/ResetPassword',
                {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
                var res = JSON.parse(await response.text());
                if (res.Result == "Changed password of user"){
                    alertMessage.style.visibility = "hidden";
                    navLogin();
                } else if (res.Result == "Could not find user to change password of"){
                    alertMessage.innerText = "User doesn't exist";
                    alertMessage.style.visibility = "visible";
                    return;
                }
            } catch (error: any){
                alert(error.toString());
                return;
            }
        }
    }

    if (stageNum == 1){
        return(
            <div id = "loginDiv">
                <span className = "font-[Lucida Sans] font-bold text-[3vh] text-[#6d91e8]">Forgot Password</span><br />
                <h5 className="mt-8 mb-0 text-white ml-[10%] float-left text-[2vh]">Enter your Email</h5>
                <input type="text" id="loginName" className = "w-8/10 text-white text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" placeholder="Email" onKeyUp={(e) => e.key === "Enter" && reclaimPass()}/><br/>
                <h5 className="mt-3 text-[#ff6384]" id = "alertmessage"></h5>

                <div className="flex justify-between absolute left-[25%] bottom-[10%] w-5/10">
                    <button className="rounded-sm inline-block bg-transparent h-fit w-fit p-[3px] pl-[7px] pr-[7px] hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] ml-2 cursor-pointer" onClick={reclaimPass}>Confirm</button>
                    <button className="rounded-sm inline-block bg-transparent h-fit w-fit p-[3px] pl-[7px] pr-[7px] hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] mr-2 cursor-pointer" onClick = {navLogin}>Back To Login</button>
                </div>
            </div>
        );
   } else if (stageNum == 2){
        return(
            <div id = "loginDivs">
                <span className = "font-[Lucida Sans] font-bold text-[3vh] text-[#6d91e8]">Forgot Password</span><br />
                <h5 className="mt-8 mb-0 ml-[10%] text-white float-left text-[2vh]">Reset your Password</h5>
                <input type="number" id="loginNames" className = "w-8/10 text-white text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" placeholder="5-digit-code" onKeyUp={(e) => e.key === "Enter" && verifyOneTimePass()}/><br/>
                <h5 className="mt-3 text-[#ff6384]" id = "alertmessage"></h5>
                <button className="absolute right-[45%] bottom-[15%] rounded-sm inline-block bg-transparent h-fit w-fit p-[3px] pl-[7px] pr-[7px] hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] mt-[5%] ml-[5%] cursor-pointer" onClick={verifyOneTimePass}>Confirm</button>
            </div>
        );
   } else if (stageNum == 3){
        return(
            <div id = "loginDivs" className="flex-col justify-center items-center">
                <span className = "font-[Lucida Sans] font-bold text-[3vh] text-[#6d91e8]">Reset Password</span><br />
                <h5 className="mb-0 mt-1 ml-[10%] text-white float-left text-[2vh]">New Password</h5>
                <div className="flex w-[100%] relative items-center">
                    <input id ="firstPass" className = "w-8/10 text-md ml-[10%] text-white rounded-sm border border-[#6d91e8] relative bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#7f8fb5] focus:ring-[#7f8fb5] p-1" type={showPasssword ? "text" : "password" } value = {value} onChange = {(e) => setValue(e.target.value)} placeholder="New Password" onKeyUp={(e) => {
                      validatePassword();
                      if (e.key === "Enter") 
                      {
                        var next = document.getElementById("secondPass") as HTMLInputElement;
                        next.focus();
                      }
                    }}></input><br/>
                    <img className="h-[2vh] absolute z-10 ml-[84%] cursor-pointer" onClick={showPasswordHandler} src={showPasssword ? show : dontshow} alt="Show/hide password button"/>
                </div>
                
                <div className="flex w-[100%] whitespace-nowrap items-center mt-1">
                    <h6 className="ml-[10%] text-[#bdc8e2] w-fit text-sm">Must contain at least&nbsp;</h6>
                    <h6 className="text-[#bdc8e2] w-fit text-sm" id={app.passnumber} style = {{color: isPasswordNumberValid ? '#36eba6' :'#ff6384'}}>1 number</h6>
                    <h6 className="text-[#bdc8e2] w-fit text-sm">,&nbsp;</h6>
                    <h6 className="text-[#bdc8e2] w-fit text-sm" id={app.passsymbol} style = {{color: isPasswordSymbolValid ? '#36eba6' : '#ff6384'}}>1 symbol</h6>
                    <h6 className="text-[#bdc8e2] w-fit text-sm">,&nbsp;</h6>
                    <h6 className="text-[#bdc8e2] w-fit text-sm" id={app.passlength} style = {{color: isPasswordLengthValid ? '#36eba6' : '#ff6384'}}>length of 8+</h6>
                    <h6 className="text-[#bdc8e2] w-fit text-sm">.</h6>
                </div>

                <h5 className="mt-3 mb-0 ml-[10%] float-left text-white text-[2vh]">Confirm Password</h5>
                <div className="flex w-[100%] relative items-center">
                    <input id ="secondPass" className = "w-8/10 text-md ml-[10%] text-white rounded-sm border border-[#6d91e8] relative bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-1 focus:ring-[#7f8fb5] focus:ring-[#7f8fb5] p-1" type={showConfirmPasssword ? "text" : "password" } placeholder="Confirm Password" onKeyUp={(e) => {validatePasswordSame();  if (e.key === "Enter") {changePassword(e);}}}></input><br/>
                    <img className="h-[2vh] absolute z-10 ml-[84%] cursor-pointer" onClick={showConfirmPasswordHandler} src={showConfirmPasssword ? show : dontshow} alt="Show/hide password button"/>
                </div>

                <h6 className="self-start ml-[10%] text-[#bdc8e2] w-fit text-sm mt-2 p-0" style={{ color: isPasswordSame ? "#36eba6" : "#ff6384" }}>
                    {isPasswordSame ? "" : "Passwords are not the same."}
                 </h6>
                 <br />
                <h5 className="absolute right-[30%] bottom-[15%] text-[#ffffff]" id = "alertmessage"></h5>
                <button className=" rounded-sm inline-block h-fit w-fit p-[3px] pl-[7px] pr-[7px] bg-transparent hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] mb-[5%] cursor-pointer" onClick={changePassword}>Confirm</button>
            </div>
        );
   }
}

export default ForgotPass;
