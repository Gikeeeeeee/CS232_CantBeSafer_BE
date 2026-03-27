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
    { userId: user.user_id, role: user.role, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );
  //return accesstoken
  return accessToken;
}
