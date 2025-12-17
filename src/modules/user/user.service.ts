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

const updateUser = async (id: string, payload: Record<string, string>, user: any) => {
  
  const {name,  email, password, phone, role} = payload;

  //customer check .. from token only updates his info only not the role ...
  // email must be uniuqe ...

  if(user.role !== 'admin' && user.id != id ) {
     throw new CustomError(
      "Access forbidden. Insufficient permissions.",
      403,
      "FORBIDDEN"
    );
  }

  if (role &&  !['admin', 'customer'].includes(role)) {
    throw new CustomError("Role is out of scope", 400, 'INVALID_ROLE');
  }

  //customer can not change role to admin ...
  if(role && role === 'admin' && user.role !== 'admin') {
    throw new CustomError(
      "Access forbidden. Insufficient permissions. customer can not change to admin",
      403,
      "FORBIDDEN"
    );
  }

  const existingUserResult = await getSingleuser(id);
  const existingUser = existingUserResult.rows[0];
  if (!existingUserResult.rowCount) {
    throw new CustomError("User not found", 404, "USER_NOT_FOUND");
  }

  if(role && user.role === 'admin'){
    // admin can promote others to admin ... 
    existingUser.role = role 
  }

  if (password) {
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


  if(name && existingUser.name !== name) {
    existingUser.name = name 
  }

  if(phone && existingUser.phone !== phone) {
    existingUser.phone = phone
  }

  if (email && email !== existingUser.email) {
    if (typeof email !== "string" || hasUpperCase(email)) {
      throw new CustomError("Email should be in lower case", 400, 'INVALID_EMAIL');
    }

    const emailQuery = `SELECT * FROM users where email = `
    const emailResult = await pool.query(emailQuery + `$1`, [email])
  
    if(emailResult.rowCount && emailResult.rowCount > 0){
      throw new CustomError("Email should be unique", 400, 'INVALID_EMAIL');
    } 
    
    existingUser.email = email
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
   const activeBookingByUserId = await pool.query(`
    select * 
    from bookings 
    where customer_id = $1 
    and status = 'active'
    limit 1`, [id])
  
  if(activeBookingByUserId.rowCount) {
    throw new CustomError(`Active booking found for id : ${id}`, 400, 'invalid_user_id');
  }

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