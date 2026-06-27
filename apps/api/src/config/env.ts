import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  MONGODB_URI: z.string(),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  const message = result.error.issues.map((e) => `${e.path.join(".")} : ${e.message}`).join(", ");
  throw new Error(message);
}

export default result.data;
