export const env = {
  JWT_SECRET: process.env.JWT_SECRET || "development-secret-key-change-in-production",
  UPSTASH_VECTOR_REST_URL: process.env.UPSTASH_VECTOR_REST_URL,
  UPSTASH_VECTOR_REST_TOKEN: process.env.UPSTASH_VECTOR_REST_TOKEN,
  NODE_ENV: process.env.NODE_ENV || "development",
}

// Only validate critical environment variables in production
if (env.NODE_ENV === "production") {
  Object.entries(env).forEach(([key, value]) => {
    if (!value && key !== "NODE_ENV") {
      console.warn(`Missing environment variable: ${key}`)
    }
  })
}
