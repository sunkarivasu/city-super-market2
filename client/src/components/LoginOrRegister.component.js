import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import {Link} from "react-router-dom";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import { blue } from "@material-ui/core/colors";import { renderIntoDocument } from "react-dom/test-utils";
import Home from "./Home.component";
import axios from "axios";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



function LoginOrRegister(props)
{
  var [open, setOpen] = useState(true);
  var [login,setLogin] = useState(true);
  

  // register
  var [Rname,setRname] = useState(null);
  var [Remail,setRemail] = useState(null); 
  var [Rpassword,setRpassword] = useState(null);
  var [Rmobile,setRmobile] = useState(null);
  var [Rcpassword,setRcpassword] = useState(null);

  //register errors
  var [RnameError,setRnameError] = useState("init");
  var [RpasswordError,setRpasswordError] = useState("init");
  var [RcpasswordError,setRcpasswordError] = useState("init");
  var [RemailError,setRemailError] = useState("init");
  var [RmobileError,setRmobileError] = useState("init");
  var [register,setRegister] = useState(false)

  //register handle
  var [checkRform,setCheckRform] = useState(false);
  var [disableRegisterButton,setDisableRegisterButton] = useState(true);


  //registration success or failure
  var [registerSuccess,setRegisterSuccess] = useState(false);
  var [registerFailure,setRegisterFailure] = useState(false);

  // login 
  var [Lemail,setLemail] = useState("");
  var [Lpassword,setLpassword] = useState("");
  var [loginUser,setLoginUser] = useState(false);


  // login error
  var [LemailError,setLemailError] = useState("init");
  var [LpasswordError,setLpasswordError] = useState("init")

  //login handle
  var [checkLform,setCheckLform] = useState(false);
  var [disableLoginButton,setDisableLoginButton] = useState(true);

  // login failure or success
  var [loginFailure,setLoginFailure] = useState();
  var [loginSuccess,setLoginSuccess] = useState(false);


  function resetRegisterForm()
  {
    setRemail("");
    setRemailError("");
    setRname("");
    setRnameError("");
    setRpassword("");
    setRpasswordError("");
    setRcpassword("");
    setRcpasswordError("");
    setRmobile("");
    setRmobileError('');
  }

  function resetLoginForm()
  {
    setLemail("");
    setLemailError("")
    setLpassword("")
    setLpasswordError("")
  }


  if(registerSuccess)
  {
    setTimeout(() =>{
      setRname("")
      setRemail("")
      setRpassword("")
      setRcpassword("")
      setRmobile("")
      setRnameError("init")
      setRemailError("init")
      setRpasswordError("init")
      setRcpasswordError("init")
      setRmobileError("init")
      setDisableRegisterButton(true)
      setLogin(true)
      setRegisterSuccess(false);
      setRegisterFailure(false);
    },3000);
  }


  if(loginSuccess)
  {
    setTimeout(() =>{
      setLemail("")
      setLpassword("")
      setRemailError("init")
      setRpasswordError("init")
      setDisableLoginButton(true)
      //setLogin(false)
      setLoginSuccess(false);
      setLoginFailure(false);
      setOpen(false);
    },3000);
  }


  if(checkRform)
  {
    console.log("Checking from")
    if(RnameError=="" && RemailError=="" && RcpasswordError=="" && RpasswordError=="" && RmobileError=="")
      setDisableRegisterButton(false)
    else
      setDisableRegisterButton(true);
    setCheckRform(false)
  }

  if(checkLform)
  {
    console.log("Checking login from")
    if(LemailError=="" && LpasswordError=="")
      setDisableLoginButton(false)
    else
      setDisableLoginButton(true);
    setCheckLform(false)
  }

  if(register)
  {
    var newUser = {
      name:Rname,
      emailId:Remail,
      password:Rpassword,
      mobile:Rmobile
    }

    axios.post("/users/add/",newUser)
    .then((res)=>{setRegisterSuccess(true)
    setRegisterFailure(false)})
    .catch((err) => {console.log("Error while registering user:"+err)
    setRegisterFailure(true)
    setRegisterSuccess(false)})
    setRegister(false)
  }

  function handleChangeLemail(event)
  {
    setLemail(event.target.value)
    if(event.target.value.length==0)
      setLemailError("Enter EmailId")
    else if(!event.target.value.match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/))
      setLemailError("Invalid EmailId")
    else
      setLemailError("")
    setCheckLform(true)
  }

  function onFocusOut()
  {
    console.log("onFocusOut working")
    axios.get("/users/checkEmailId/"+Remail)
    .then((res)=>{
      console.log(res.data.success)
      if(res.data.success==false)
        setRemailError("Email Id Already exists")
    })
    .catch((err)=>console.log("Error while checking email Id:"+err));
  }

  function handleChangeLpassword(event)
  {
    setLpassword(event.target.value);
    if(event.target.value.length==0)
      setLpasswordError("Enter Password")
    else
      setLpasswordError("");
    setCheckLform(true);
  }


  function handleRegister()
    {
      resetLoginForm();
      setLogin(false);
    }

  function handleLogin()
  {
    resetRegisterForm();
    setLogin(true);
  }

  function handleToLogin()
  {
    setLoginUser(true);
  }

  function RnameOnchange(event)
  {
    setRname(event.target.value)
    console.log(event.target.value.length);
    if(event.target.value=="")
      setRnameError("Enter Name")
    if(event.target.value.length<6)
      setRnameError("Name should contain atleast 6 characters");
    else if(!event.target.value.match(/^[a-zA-z ]{6,}$/gm))
      setRnameError("Name should contain only characters")
    else
      setRnameError("");

    setCheckRform(true)
  } 

  function RemailOnChange(event)
  {
    setRemail(event.target.value);
    if(event.target.value.length==0)
      setRemailError("Enter EmailId")
    else if(!event.target.value.match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/))
      setRemailError("Invalid EmailId")
    else
      setRemailError("")
    
    setCheckRform(true)
    
  }

  function RpasswordOnChange(event)
  {
    setRpassword(event.target.value)
    if(event.target.value=="")
      setRpasswordError("Enter Password")
    else if (event.target.value.length<6)
      setRpasswordError("Password sholud contain atleast 6 characters");
    else if(!event.target.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/gm))
      setRpasswordError("Weak password");
    else
      setRpasswordError("")
    
    checkRcpassword(Rcpassword,event.target.value);
    setCheckRform(true)
    
  }

  function checkRcpassword(cp,p)
  {
    if(cp=="")
      setRcpasswordError("Confirm Password")
    else if(cp!=p)
      setRcpasswordError("Passwords did not match");
    else
      setRcpasswordError("")
  }

  function RcpasswordOnChange(event)
  {
    setRcpassword(event.target.value)
    checkRcpassword(event.target.value,Rpassword)
    setCheckRform(true)
  }

  function RmobileOnChange(event)
  {
    var l = event.target.value.length
    var lc = event.target.value.charAt(l-1)
    if(lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9')
      if(event.target.value.length>10)
        setRmobile(event.target.value.slice(0,l-1))
      else
        setRmobile(event.target.value);
    else
      setRmobile(event.target.value.slice(0,l-1))
      
    
    if(event.target.value=="")
      setRmobileError("Enter Mobile Number")
    else if (event.target.value.length<10)
      setRmobileError("Mobile number should contain 10 digits");
    else
      setRmobileError("");

    setCheckRform(true)
    

  }

  function handleToRegister()
  {
    setRegister(true)
  }

  
  const handleToClose = () => {
    setOpen(false);
  };

  // Toast functions
  function RegistrationSuccess()
  {
    return <div className="registration-success-msg" style={{color:"green",textAlign:"center",marginBottom:"0px",paddingTop:"10px"}}>Successfully Registered</div>
  }

  
      if(loginUser)
      {
        console.log("Hi")
        var user ={
          emailId:Lemail,
          password:Lpassword
        }
        console.log(user)
        axios.post("/users/login",user)
        .then((res) =>{
          console.log(res);
          if(res.data.success==true)
          {
            localStorage.setItem("token",res.data.token);
            localStorage.setItem("user",JSON.stringify(res.data.user));
            setLoginUser(false);
            setLoginSuccess(true)
            props.handleLoggedIn();
            props.handleCloseDailog();
          }
          else
          {
            console.log("invalid password or emailId")
            setLoginFailure(res.data.msg);
            // setLoginSuccess(false);
            setLoginUser(false);
          }
        })
        .catch((err)=>{console.log("Error while logging the user."+err)})
      }
      

  
  if(login)
  {
    return (
        <div className="login-dialog-box">
          {/* onClose={handleToClose}  open={open}*/}
          {/* <Home/> */}
          <Dialog  open={props.show} onClose={handleToClose} style={{margin:"0px"}}>
            <DialogTitle style={{textAlign:"right",height:"0px",position:"absolute",padding:"0px",backgroundColor:"transparent"}}>
                <button style={{marginLeft:"10px",color:"white",textDecoration:"none",backgroundColor:"transparent",border:"none"}} onClick={props.handleCloseDailog}>X</button>
            </DialogTitle>
            <DialogContent style={{padding:"0px",borderRadius:"0px"}}>
            <div className="row" style={{width:"100%"}}>
              <div className="col-md-6 dialog-image" style={{backgroundColor:"#172337"}}>
                {/* <h1 style={{margin:"150px 40px",color:"#fff"}}>Login</h1> */}
                {/* <img className="dailog-img" src="csmFavicon.png" style={{width:"200px",height:"200px"}}/> */}
              </div>
              <div className="col-md-6 dialog-form">
                  <form style={{"padding":"30px 10px","textAlign":"left"}}>
                  <TextField
                    className="textField"
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={Lemail}
                    onChange={handleChangeLemail}
                    style={{"marginBottom":"10px",marginTop:"0px"}}  
                  />
                  {LemailError.length>0 && LemailError!="init" && <p className="err">{LemailError}</p>}
                  <TextField
                    className="textField"
                    margin="dense"
                    id="name"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={Lpassword}
                    onChange={handleChangeLpassword}
                    style={{"marginBottom":"10px",marginTop:"0px"}}
                  />
                  {LpasswordError.length>0 && LpasswordError!="init" && <p className="err">{LpasswordError}</p>}
                  {loginFailure && <div style={{color:"red",fontSize:"0.8em"}}>{loginFailure}</div>}

                  </form>
                  <div className="dailog-login-btn" style={{textAlign:"left",marginBottom:"10px",color:"white",borderRadius:"5px",marginLeft:"5px"}}>
                    <button onClick={handleToLogin} className="form-control btn btn-primary" disabled={disableLoginButton}>
                        Login
                    </button>
                  </div>
                  
                  <input type="text" style={{visibility:"hidden"}}></input>
                  <input type="text" style={{visibility:"hidden"}}></input>
                  <input type="text" style={{visibility:"hidden"}}></input>
  
                  <div className="do-not-have-account-btn" style={{textAlign:"center",width:"100%",margin:"50px 0px 20px 0px",display:"inline-block"}}>
                    {/* onClick={handleRegister} */}
                    <p> Don't have an account? <a href="#" onClick={handleRegister}>Register</a></p>
                  </div>
              </div>
            </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
    else
    {
        return (
          <div className="register-dialog-box">
          {/* <Home/> */}
          <Dialog open={props.show} onClose={handleToClose} style={{maxWidth:"maxContent",margin:"auto"}}>
            <DialogTitle style={{textAlign:"right",height:"0px",position:"absolute",padding:"0px",backgroundColor:"transparent"}}>
                <button style={{marginLeft:"10px",color:"white",textDecoration:"none",backgroundColor:"transparent",border:"none"}} onClick={props.handleCloseDailog}>X</button>
            </DialogTitle>
            <DialogContent style={{padding:"0px",minWidth:"600px"}}>
              <div className="row" style={{width:"100%"}}>
                <div className="col-md-6 dialog-image" style={{backgroundColor:"#172337"}}>
                  {/* <img className="dailog-img" src="csmFavicon.png" style={{width:"200px",height:"200px"}}/>                 */}
                </div>
                <div className="col-md-6 dialog-form" style={{padding:"20px"}}>
                  <form style={{"padding":"10px 10px 20px 10px","textAlign":"left"}}>
                  <TextField
                      className="textField"
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Name"
                      type="text"
                      fullWidth
                      variant="standard"
                      style={{marginTop:"0px"}}
                      value={Rname}
                      onChange={RnameOnchange}
                    />
                    {RnameError.length>0 && RnameError!="init" && <p className="err">{RnameError}</p>}
                    <TextField
                      className="textField"
                      margin="dense"
                      id="emailId"
                      label="Email Address"
                      type="email"
                      fullWidth
                      variant="standard"
                      value={Remail}
                      style={{marginTop:"0px"}}
                      onChange={RemailOnChange} 
                      onBlur={onFocusOut}
                    />
                    {RemailError.length>0 && RemailError!="init" && <p className="err">{RemailError}</p>}
                    <TextField
                      className="textField"
                      margin="dense"
                      id="password"
                      label="Password"
                      type="password"
                      fullWidth
                      variant="standard"
                      value={Rpassword}
                      style={{marginTop:"0px"}}
                      onChange={RpasswordOnChange}
                    />
                    {RpasswordError.length>0 && RpasswordError!="init" && <p className="err">{RpasswordError}</p>}
                    <TextField
                      className="textField"
                      margin="dense"
                      id="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      fullWidth
                      variant="standard"
                      value={Rcpassword}
                      style={{marginTop:"0px"}}
                      onChange={RcpasswordOnChange}
                    />
                    {RcpasswordError.length>0 && RcpasswordError!="init" && <p className="err">{RcpasswordError}</p>}
                    <TextField
                      className="textField"
                      margin="dense"
                      id="mobileNumber"
                      label="Mobile"
                      type="text"
                      fullWidth
                      variant="standard"
                      value={Rmobile}
                      style={{marginTop:"0px"}}
                      onChange={RmobileOnChange}
                    />
                    {RmobileError.length>0 && RmobileError!="init" && <p className="err">{RmobileError}</p>}
                    
                  </form>

                  <div className="dialog-register-btn" style={{textAlign:"left",marginBottom:"10px",padding:"0px",color:"white",borderRadius:"5px",marginLeft:"5px"}}>
                    <button onClick={handleToRegister} className="form-control btn btn-primary"  disabled={disableRegisterButton}>
                        Register
                    </button>
                  </div>
                  
                  <div className="already-have-account-btn" style={{"textAlign":"center","margin":"30px 0px 30px "}}>
                    <p> Already have account? <a href="#" onClick={handleLogin}>Login</a></p>
                  </div>
                  {registerSuccess ?<p className="successMsg">User Registered successfully</p>:<p></p>}
                  {registerFailure ?<p className="failureMsg">Please Try Again</p>:<p></p>}
                </div>
              </div>
            </DialogContent>
          </Dialog>
         
        </div>
        );
    }
    
    
}

export default LoginOrRegister;
