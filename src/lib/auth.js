import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient, ObjectId } from "mongodb";

const globalForMongo = globalThis;
const client = (globalForMongo._wedplanMongo ??= new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 5,
  family: 4,
}));
export const db = client.db(process.env.MONGODB_DB || "wedplan");

const cookieValue = (headers, name) => {
  const raw = headers?.get?.("cookie") || "";
  const m = raw.split(/;\s*/).find((c) => c.startsWith(name + "="));
  return m ? decodeURIComponent(m.split("=")[1]) : null;
};

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL].filter(Boolean),
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET },
  },
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      businessName: { type: "string", required: false, input: true },
      phone: { type: "string", required: false, input: true },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  hooks: {
    // Password rule: min 6, one uppercase, one lowercase (server-side enforcement)
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const pw = ctx.body?.password || "";
        if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(pw)) {
          throw new APIError("BAD_REQUEST", { message: "Password needs 6+ characters with an uppercase and a lowercase letter" });
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        // Public registration থেকে কখনো admin তৈরি হবে না
        before: async (user, ctx) => {
          const wanted = user.role || cookieValue(ctx?.headers, "wp_signup_role");
          return { data: { ...user, role: wanted === "vendor" ? "vendor" : "customer", isBlocked: false, subscriptionPlan: "free", subscriptionExpiresAt: null } };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const id = ObjectId.isValid(session.userId) ? new ObjectId(session.userId) : session.userId;
          const u = await db.collection("users").findOne({ _id: id });
          if (u?.isBlocked) throw new APIError("FORBIDDEN", { message: "Your account has been blocked. Contact support." });
          return { data: session };
        },
      },
    },
  },
});
