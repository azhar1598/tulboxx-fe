export const decodeJwtToken = (token: string) => {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch (error) {
    console.error("Token decoding error:", error);
    throw new Error("Token decoding error");
  }
};
