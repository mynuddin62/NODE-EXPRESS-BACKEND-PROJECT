import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { hasUpperCase } from "../../utils/stringUtils";
import CustomError from "../../error/customError";

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new CustomError("Email or Password is incorrect", 401, 'UNAUTHORIZED');
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  console.log({ match, user });
  if (!match) {
     throw new CustomError("Email or Password is incorrect", 401, 'UNAUTHORIZED');
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );

  user.password = undefined;
  user.created_at = undefined;
  user.updated_at = undefined;
  
  return { token, user };
};

const signupUser = async (payload: Record<string, string>) => {
  const {name,  email, password, phone, role} = payload;
  
  if (!name || typeof name !== 'string') {
    throw new CustomError("Name is required", 400, 'INVALID_NAME');
  }

  if (!phone) {
    throw new CustomError("Phone is required", 400, 'INVALID_PHONE');
  }

  if (!role || typeof role !== 'string') {
    throw new CustomError("Role is required", 400, 'INVALID_ROLE');
  }

  if (!['admin', 'customer'].includes(role)) {
    throw new CustomError("Role is out of scope", 400, 'INVALID_ROLE');
  }
  
  if (!email || typeof email !== 'string' || hasUpperCase(email)) {
    throw new CustomError("Email should be in lower case", 400, 'INVALID_EMAIL');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new CustomError("Password should be minimum 6 characters", 400, 'INVALID_PASSWORD');
  }

  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, role, email, password, phone) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, role, email, hashedPass, phone]
  );

  result.rows[0].password = undefined;
  result.rows[0].created_at = undefined;
  result.rows[0].updated_at = undefined;
  return result;
};




export const authServices = {
  loginUser,
  signupUser
};