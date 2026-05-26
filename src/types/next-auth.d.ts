import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string; // 👈 so authorize() return type accepts role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // 👈 so token.role is typed
  }
}
