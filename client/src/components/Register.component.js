import React from "react";
import Dialog from "@material-ui/core/Dialog";
import {Link} from "react-router-dom";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from '@material-ui/core/TextField';
import Home from "./Header.component";


function Register()
{
   return (
                <div className="register-dialog-box">
                  <Home/>
                  <Dialog open={true}  style={{maxWidth:"maxContent",margin:"auto"}}>
                    <DialogContent style={{padding:"0px"}}>
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
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="Confirm Password"
                              type="password"
                              fullWidth
                              variant="standard"
                              style={{"marginBottom":"10px"}}
                            />
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="Mobile"
                              type="text"
                              fullWidth
                              variant="standard"
                              style={{"marginBottom":"10px"}}
                            />
                          </form>
                          <div className="dialog-register-btn" style={{"textAlign":"center","marginBottom":"10px","backgroundColor":"blue","color":"white","borderRadius":"5px","marginLeft":"5px"}}>
                            {/* onClick={handleToClose} */}
                            <button  style={{color:"white",backgroundColor:"blue",border:"none",padding:"5px 20px",borderRadius:"3px",fontSize:"0.95em",textTransform:"uppercase",lineHeight:"2em",letterSpacing:"1px",textAlign:"center"}}>
                                Register
                            </button>
                          </div>
                          <div className="already-have-account-btn" style={{"textAlign":"center","margin":"30px 0px 30px "}}>
                          {/* onClick={handleLogin} */}
                            <p> Already have account? <Link to="/login">Login</Link></p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                );
}

export default Register;