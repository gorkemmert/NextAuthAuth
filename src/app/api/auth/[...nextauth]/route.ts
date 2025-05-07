import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextAuthOptions } from "next-auth";


declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }

  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}

export const authOptions: NextAuthOptions  = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "your-username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(process.env.AUTH_LOGIN_API!, {
            username: credentials?.username,
            password: credentials?.password,
          });
          
          
          if (response?.data && response?.data?.data?.accessToken ) {
            return {
              id: response?.data?.userId,
              username: credentials?.username,
              accessToken: response?.data?.data?.accessToken,
              refreshToken: response?.data?.data?.refreshToken,
              accessTokenExpires: Date.now() + 60 * 60 * 1000,
            };
          }

          throw new Error("Invalid credentials");
        } catch (error) {
          throw new Error("Invalid username or password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
        };
      }

    
      if (Date.now() > token.accessTokenExpires) {
        try {
          const response = await axios.post(process.env.AUTH_REFRESH_API!, {
            refreshToken: token.refreshToken,
          });
          console.log("response2", response);
          if (response.data && response.data.data?.accessToken) {
            return {
              ...token,
              accessToken: response.data.data.accessToken,
              refreshToken: response.data.data.refreshToken,
              accessTokenExpires: Date.now() + response.data.data.expiresIn * 1000
            };
          }
          return { ...token, accessToken: null, refreshToken: null };
        } catch (error) {
          console.error("Failed to refresh token", error);
          return { ...token, accessToken: null, refreshToken: null };
        }
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (!token?.accessToken) {
        console.log("Session invalid — redirecting to login.");
        return null;
      }
    
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
