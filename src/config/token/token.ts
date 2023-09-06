import jwt from "jsonwebtoken";

export const generateJwtToken = (_id: any) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
};

export const resetJwtToken = (_id: any) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET!, { expiresIn: 60 * 60 });
};

export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
