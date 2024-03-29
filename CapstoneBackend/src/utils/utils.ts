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
  let otp = "";
  for (let i = 0; i < 6; i++) {
    const char = Math.floor(Math.random() * 9 + 1);
    otp += char.toString();
  }
  return Number(otp);
}

export function discountedPRice(price: number, discountpercent: number) {
  if (discountpercent <= 0 || !discountpercent) {
    return 0;
  }

  const newPrice = (discountpercent * price) / 100;
  return price - newPrice;
}
