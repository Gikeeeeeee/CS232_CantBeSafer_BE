import express, { Request, Response } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername } from '../models/UserModel';

export const handleLogin = async ( username: string, passwordText: string) => {
  //findby username
  const user = await findUserByUsername(username);
  //if not found return null
  if (!user) return null;
  //compare bcrypt
  const isMatch = await bcrypt.compare(passwordText, user.password_hash);
  //if not return null
  if (!isMatch) return null;
  //generate jwt accesstoken
  const accessToken = jwt.sign(
    { 
      user_id: user.user_id, 
      role: user.role, 
      username: user.username 
    },
    process.env.TOKEN_KEY as string,
    { expiresIn: '2h' }
  );
  //return accesstoken
  return accessToken;
}
