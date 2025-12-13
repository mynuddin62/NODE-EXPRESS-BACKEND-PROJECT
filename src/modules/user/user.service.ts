import { pool } from "../../config/db";
import CustomError from "../../error/customError";
import { hasUpperCase } from "../../utils/stringUtils";
import bcrypt from "bcryptjs";
import { UserResponse } from "./userResponse";

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  const users = result.rows.map((row) => new UserResponse(row));
  return users;
};


const getSingleuser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};


const getSingleCustomerUser = async (id: string) => {
  const result = await pool.query(`
    SELECT * FROM users 
    WHERE id = $1
    AND role = 'customer'
    `, [id]);
  return result;
};

const updateUser = async (id: string, payload: Record<string, string>) => {
  
  const {name,  email, password, phone, role} = payload;
  
  const existingUserResult = await getSingleuser(id);
  if (!existingUserResult.rowCount) {
    throw new CustomError("User not found", 404, "USER_NOT_FOUND");
  }

  const existingUser = existingUserResult.rows[0];

  const isAdmin = existingUser.role === "admin";

  if (isAdmin && existingUser.id != id) {
    throw new CustomError(
      "Access forbidden. Insufficient permissions.",
      403,
      "FORBIDDEN"
    );
  }

  if(!isAdmin && role === 'admin'){
     throw new CustomError(
      "Access forbidden. Customer can not change role to admin",
      403,
      "FORBIDDEN"
    );
  }

  existingUser.role = role 


  if (email && email !== existingUser.email) {
    if (typeof email !== "string" || hasUpperCase(email)) {
      throw new CustomError("Email should be in lower case", 400, 'INVALID_EMAIL');
    }
    existingUser.email = email
  }


  if (password) {
    if (password !== existingUser.password) {
      if (password.length < 6) {
        throw new CustomError(
          "Password should be minimum 6 characters",
          400,
          "INVALID_PASSWORD"
        );
      }

      const hashedPass = await bcrypt.hash(password, 10);
      existingUser.password = hashedPass
    }
  }

  if(name && existingUser.name !== name) {
    existingUser.name = name 
  }

  if(phone && existingUser.phone !== phone) {
    existingUser.phone = phone
  }


  const result = await pool.query(
  `UPDATE users 
   SET name = $1,
       email = $2,
       password = $3,
       phone = $4,
       role = $5
   WHERE id = $6
   RETURNING *`,
  [
    existingUser.name, 
    existingUser.email, 
    existingUser.password, 
    existingUser.phone, 
    existingUser.role, 
    id]
);


  result.rows[0].password = undefined;
  result.rows[0].created_at = undefined;
  result.rows[0].updated_at = undefined;
  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userServices = {
  getUser,
  updateUser,
  deleteUser,
  getSingleCustomerUser,
  getSingleuser,
};