/**
 * A type representing a valid username. Must start with a letter,
 * contain only alphanumeric characters or underscores, and be between 3 and 15 characters long.
 */
export type Username = string & { readonly isUsername: unique symbol };

/**
 * Check if a string is a valid username based on the defined criteria.
 * @param value - The string to be validated.
 * @returns Whether the string is a valid username.
 */
export const isValidUsername = (value: string): value is Username => {
  const usernameRegex = /^[a-zA-Z][\w_]+$/;
  return usernameRegex.test(value) && value.length >= 3 && value.length <= 15;
};

/**
 * Parse a string into a safe integer, throwing an error if the parsing fails.
 * @param value - The string to be parsed.
 * @returns The parsed integer value.
 */
export const parseSafeInt = (value: string): number => {
  const parsedValue = parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw new Error(`Invalid integer: ${value}`);
  }
  return parsedValue;
};
