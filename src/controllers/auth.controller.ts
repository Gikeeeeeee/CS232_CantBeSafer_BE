import { Request, Response } from 'express';
import { handleLogin } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  const { Username, Password } = req.body;

  const accessToken = await handleLogin(Username, Password);
  
  if (!accessToken) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  return res.status(200).json({ AccessToken: accessToken });
};
