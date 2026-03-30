import express, { Request, Response } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, MakeUser,findUserByEmail } from '../models/UserModel';

export const handleLogin = async ( username: string, passwordText: string) => {
  const user = await findUserByUsername(username);
  if (!user) return null;
  const isMatch = await bcrypt.compare(passwordText, user.password_hash);
  if (!isMatch) return null;
  const accessToken = jwt.sign(
    { 
      user_id: user.user_id, 
      role: user.role, 
      username: user.username 
    },
    process.env.TOKEN_KEY as string,
    { expiresIn: '2h' }
  );
  return accessToken;
}

export const handleSignUp = async(username:string,password:string,passwordConfirm:string,Email:string)=>{
  if(password !== passwordConfirm){
    throw new Error("Passwords do not match");
  }
  const existingUser = await findUserByEmail(Email);
  if(existingUser){
    const error:any = new Error("Email already registered");
    error.code = '23505';
    throw error;  
  }
  const saltRounds = 12;
  const hashPasswordword = await bcrypt.hash(password,saltRounds);
  
  const user = await MakeUser(username,hashPasswordword,Email)
    
  return {id:user.user_id};
}