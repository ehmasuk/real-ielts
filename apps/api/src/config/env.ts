import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string(),
  INTERNAL_API_KEY: z.string().min(16),
  FRONTEND_URL: z.string().url(),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  const message = result.error.issues.map((e) => `${e.path.join(".")} : ${e.message}`).join(", ");
  throw new Error(message);
}

export default result.data;
