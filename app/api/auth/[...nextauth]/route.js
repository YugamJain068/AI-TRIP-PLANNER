import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import connectDb from "@/db/connectDb";
import User from "@/db/models/User";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDb();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            const error = new Error("UserNotFound");
            error.name = "UserNotFound";
            throw error;
          }

          if (user.oauthProvider) {
            const error = new Error(`UseOAuth:${user.oauthProvider}`);
            error.name = "UseOAuth";
            throw error;
          }

          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            const error = new Error("IncorrectPassword");
            error.name = "IncorrectPassword";
            throw error;
          }

          return { 
            id: user._id.toString(), 
            email: user.email, 
            username: user.username 
          };
        } catch (error) {
          console.error("Credentials authorize error:", error);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
  },

  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDb();
        
        // For OAuth providers
        if (account && ["google", "facebook", "github"].includes(account.provider)) {
          const email = user.email || profile?.email;
          
          if (!email) {
            console.error("No email found for OAuth user");
            return false;
          }

          let dbUser = await User.findOne({ email });

          if (dbUser) {
            if (!dbUser.oauthProvider) {
              console.error("Email already registered with password");
              return `/oauth-callback?error=EmailExistsWithPassword`;
            } else if (dbUser.oauthProvider !== account.provider) {
              console.error(`Please login using ${dbUser.oauthProvider}`);
              return `/oauth-callback?error=UseProvider&provider=${dbUser.oauthProvider}`;
            }
          } else {
            dbUser = await User.create({
              email,
              username: profile?.name || user.name || "Unnamed User",
              oauthProvider: account.provider,
              oauthId: profile?.id || account.providerAccountId,
            });
          }
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user, account, profile }) {
      try {
        await connectDb();

        if (user) {
          if (account && ["google", "facebook", "github"].includes(account.provider)) {
            const email = user.email || profile?.email;
            const dbUser = await User.findOne({ email });

            if (dbUser) {
              token.id = dbUser._id.toString();
              token.username = dbUser.username;
              token.email = dbUser.email;
            }
          } else {
            token.id = user.id;
            token.username = user.username;
            token.email = user.email;
          }
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.id;
          session.user.username = token.username;
          session.user.email = token.email;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },

    async redirect({ url, baseUrl }) {
      if (url.includes("error=")) {
        return url;
      }
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
