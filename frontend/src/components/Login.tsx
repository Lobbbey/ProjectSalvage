import app from "../pages/App.module.css";

function Login(){
  function doLogin(event:any) : void {
    event.preventDefault();
    alert('doIt()');
  }
  return(
    <div id="loginDiv">
      <span id="inner-title">LOG IN</span><br />
      <h5 className={app.loginlabel}>Email</h5>
      <input type="text" id="loginName" className = {app.logininputs} placeholder="Email" /><br />
      <h5 className={app.loginlabel}>Password</h5>
      <input type="password" id="loginPassword" className = {app.logininputs} placeholder="Password" /><br />
      <button className={app.loginbuttons} id={app.dologinbutton} onClick={doLogin}>Login</button>
      <span id="loginResult"></span>
    </div>
  );
}

export default Login;
