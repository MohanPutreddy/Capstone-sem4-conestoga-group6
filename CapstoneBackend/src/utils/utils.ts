import bcrypt from "bcrypt";

export const hash = async (password: string) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Error while hash");
  }
};

export const compare = async (password: string, hash: string) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

export function otp() {
  // return [
  //   Math.floor(Math.random() * 10),
  //   Math.floor(Math.random() * 10),
  //   Math.floor(Math.random() * 10),
  //   Math.floor(Math.random() * 10),
  // ].join("");
  let otp = "";
  for (let i = 0; i < 6; i++) {
    const char = Math.floor(Math.random() * 10);
    otp += char.toString();
  }
  return Number(otp);
}
