import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const envSchema = z.object({
    MONGODB_URI: z.string(),
    JWT_SECRET: z.string().min(32),
    GOOGLE_CLIENT_ID: z.string(),
    INTERNAL_API_KEY: z.string().min(16),
    // Comma-separated list of allowed frontend origins (CORS whitespace-safe),
    // e.g. "http://localhost:3000,https://www.realielts.tech,https://realielts.tech"
    FRONTEND_URL: z.string().superRefine((value, ctx) => {
        const urls = value
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean);
        const invalid = urls.filter((u) => {
            try {
                new URL(u);
                return false;
            }
            catch {
                return true;
            }
        });
        if (urls.length === 0 || invalid.length > 0) {
            ctx.addIssue({
                code: "custom",
                message: `FRONTEND_URL must be a comma-separated list of valid URLs; got "${invalid.length > 0 ? invalid.join(", ") : value}"`,
            });
        }
    }),
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
    const message = result.error.issues.map((e) => `${e.path.join(".")} : ${e.message}`).join(", ");
    throw new Error(message);
}
export default result.data;
//# sourceMappingURL=env.js.map