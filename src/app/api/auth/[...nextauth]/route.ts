import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
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
              accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 dakika sonra süresi dolacak
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
    async jwt({ token, user }) {
      // İlk girişte kullanıcı verilerini JWT içine kaydediyoruz
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
        };
      }

      // Token süresi dolmuşsa refresh token ile yeniliyoruz
      if (Date.now() > token.accessTokenExpires) {
        try {
          const response = await axios.post(process.env.AUTH_REFRESH_API!, {
            refreshToken: token.refreshToken,
          });

          if (response.data && response.data.token) {
            return {
              ...token,
              accessToken: response.data.token,
              refreshToken: response.data.refreshToken,
              accessTokenExpires: Date.now() + 15 * 60 * 1000, // Yeni süre
            };
          }
        } catch (error) {
          console.error("Failed to refresh token", error);
          return { ...token, accessToken: null, refreshToken: null };
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
