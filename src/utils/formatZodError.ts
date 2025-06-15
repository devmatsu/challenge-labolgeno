import { ZodError } from 'zod';

export function formatZodError(error: ZodError): Record<string, string> {
  const { fieldErrors } = error.flatten();

  const formatted: Record<string, string> = {};

  for (const key in fieldErrors) {
    if (fieldErrors[key] && fieldErrors[key]!.length > 0) {
      formatted[key] = fieldErrors[key]![0];
    }
  }

  return formatted;
}
