/**
 * A type representing a valid username. Must start with a letter,
 * contain only alphanumeric characters or underscores, and be between 3 and 15 characters long.
 */
export type Username = string & {
    readonly isUsername: unique symbol;
};
/**
 * Check if a string is a valid username based on the defined criteria.
 * @param value - The string to be validated.
 * @returns Whether the string is a valid username.
 */
export declare const isValidUsername: (value: string) => value is Username;
/**
 * Parse a string into a safe integer, throwing an error if the parsing fails.
 * @param value - The string to be parsed.
 * @returns The parsed integer value.
 */
export declare const parseSafeInt: (value: string) => number;
//# sourceMappingURL=index.d.ts.map