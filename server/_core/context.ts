import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { getUserByOpenId, upsertUser } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
    if (process.env.LOCAL_GUEST_MODE === "true") {
      const openId = "local-guest";
      try {
        await upsertUser({
          openId,
          name: "Local Guest",
          email: null,
          loginMethod: "guest",
          role: "admin",
          lastSignedIn: new Date(),
        } as any);
        const dbUser = await getUserByOpenId(openId);
        if (dbUser) {
          user = dbUser;
        } else {
          user = {
            id: 1,
            openId,
            name: "Local Guest",
            email: null,
            loginMethod: "guest",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
            lastSignedIn: new Date(),
          } as User;
        }
      } catch {
        user = {
          id: 1,
          openId,
          name: "Local Guest",
          email: null,
          loginMethod: "guest",
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        } as User;
      }
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
