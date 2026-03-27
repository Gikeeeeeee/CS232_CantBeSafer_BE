import { Request, Response } from 'express';
import { handleLogin, handleSignUp } from '../services/auth.service';
import { error } from 'node:console';

export const login = async (req: Request, res: Response) => {
  const { Username, Password } = req.body;

  const accessToken = await handleLogin(Username, Password);
  
  if (!accessToken) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  return res.status(200).json({ AccessToken: accessToken });
};


export const sign_up = async (req:Request,res:Response) => {
  try{
    const {Username,Password,PasswordConfirm,Email} = req.body;
    if(!Email || !Password || !Username || !PasswordConfirm) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await handleSignUp(Username,Password,PasswordConfirm,Email)
    
    return res.status(201).json({
      message: "User created successfullt" ,
      user: {id:user.id}
    });
  }
  catch(error : any){
      if(error.message  === "Passwords do not match"){
        return res.status(400).json({
          message:error.message
        });
      }

      console.error("Signup error:",error);
      return res.status(500).json({ message: "Internal server errorBRUH" });
  }
  
}