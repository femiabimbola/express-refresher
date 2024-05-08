import bcrypt from "bcrypt";

const saltRounds = 10; // recommend from docs

export const hashPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain: string, hashed: string) => {
  return bcrypt.compareSync(plain, hashed); // return boolean
};
