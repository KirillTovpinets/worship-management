import { SongKey } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    key?: SongKey;
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
      key?: SongKey;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    key?: SongKey;
  }
}
