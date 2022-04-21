import React from "react";
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

  
function Login(props) {    
    return (
      <div className="login-dialog-box">
        <Home/>
        <Dialog  open={true}  style={{margin:"0px"}}>
          <DialogContent style={{padding:"0px",borderRadius:"0px"}}>
          <div className="row" style={{width:"100%"}}>
            <div className="col-md-6 dialog-image" style={{backgroundColor:"#019267"}}>
            
            </div>
            <div className="col-md-6 dialog-form">
                <form style={{"padding":"30px 10px","textAlign":"center"}}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                  style={{"marginBottom":"10px"}}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  style={{"marginBottom":"10px"}}
                />
                
                
                </form>
                
                <div className="dailog-login-btn" style={{textAlign:"left",marginBottom:"10px",color:"white",borderRadius:"5px",marginLeft:"5px"}}>
                  {/* onClick={handleToClose */}
                  <button style={{color:"white",backgroundColor:"blue",border:"none",padding:"5px 20px",borderRadius:"3px",fontSize:"0.95em",textTransform:"uppercase",lineHeight:"2em",letterSpacing:"1px",width:"100%"}}>
                      Login
                  </button>
                </div>
                
                <input type="text" style={{visibility:"hidden"}}></input>
                <input type="text" style={{visibility:"hidden"}}></input>

                <div className="do-not-have-account-btn" style={{textAlign:"center",width:"100%",margin:"50px 0px 20px 0px",display:"inline-block"}}>
                  {/* onClick={handleRegister} */}
                  <p> Don't have an account? <Link to="/register" >Register</Link></p>
                </div>
            </div>
          </div>
            
          </DialogContent>
        </Dialog>
      </div>
    );
}
export default Login;


