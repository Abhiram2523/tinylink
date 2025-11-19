import { z } from 'zod'

// URL validation schema
export const urlSchema = z.string().url('Please enter a valid URL')

// Code validation schema - must be 6-8 alphanumeric characters
export const codeSchema = z
  .string()
  .regex(/^[A-Za-z0-9]{6,8}$/, 'Code must be 6-8 alphanumeric characters')

// Link creation schema
export const createLinkSchema = z.object({
  targetUrl: urlSchema,
  code: codeSchema.optional(),
})

export type CreateLinkInput = z.infer<typeof createLinkSchema>

// Generate random code (6-8 characters)
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function generateRandomCode(length: number = 7): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
  }
  return result
}

// Validate URL format
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Validate code format [A-Za-z0-9]{6,8}
export function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code)
}

