import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// type TokenPayload = {
//   id: string;
//   roleId: string;
//   role: string;
// };

// type CreateSecretTokenFn = (
//   id: string,
//   roleId: string,
//   role: string
// ) => string;

// // Define the createSecretToken function
// const createSecretToken: CreateSecretTokenFn = (id, roleId, role) => {
//   return jwt.sign({ id, roleId, role }, process.env.TOKEN_KEY as string, {
//     expiresIn: 3 * 24 * 60 * 60,
//   });
// };

// // Export the function
// export default createSecretToken;