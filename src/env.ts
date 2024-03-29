import { z } from 'zod'

const environment = z.object({
})

try {
  environment.parse(process.env)
} catch (err) {
  if (err instanceof z.ZodError) {
    const { fieldErrors } = err.flatten()

    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) =>
        errors ? `${field}: ${errors.join(", ")}` : field,
      )
      .join("\n  ")

    throw new Error(
      `Missing environment variables:\n  ${errorMessage}`,
    )
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof environment> { }
  }
}