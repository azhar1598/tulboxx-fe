import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { decodeJwtToken } from "./tokenFn";
import { BASE_URL } from "@/services/apiService";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),

    CredentialsProvider({
      id: "signin",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const { data } = await axios.post(`${BASE_URL}/v1/auth/signin`, {
            email: credentials.email,
            password: credentials.password,
          });

          const jwtDecode = decodeJwtToken(data.data.token);

          const user: any = {
            id: jwtDecode.id,
            email: jwtDecode.email,
            name: jwtDecode.name,
            accessToken: data.data.token,
          };

          return user;
        } catch (error: any) {
          console.error("Authorization error:", error);
          throw new Error(error.response?.data || "Authorization failed");
        }
      },
    }),
    CredentialsProvider({
      id: "signup",
      name: "Sign Up",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "John Doe" },
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials?.name ||
          !credentials?.email ||
          !credentials?.password
        ) {
          throw new Error("Missing credentials");
        }

        try {
          const { data } = await axios.post(`${BASE_URL}/v1/auth/signup`, {
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
          });
          const jwtDecode = decodeJwtToken(data.data.token);
          const user: any = {
            id: jwtDecode.id,
            email: jwtDecode.email,
            name: jwtDecode.name,
            accessToken: data.data.token,
          };

          return user;
        } catch (error: any) {
          console.error("Authorization error:", error?.response.data);
          throw new Error(error.response.data || "Authorization failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};
