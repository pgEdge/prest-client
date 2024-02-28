/*!
 * prest-client v0.0.1
 * (c) pgEdge
 * Released under the MIT License.
 */

'use strict';

/**
 * Check if a string is a valid username based on the defined criteria.
 * @param value - The string to be validated.
 * @returns Whether the string is a valid username.
 */
var isValidUsername = function (value) {
    var usernameRegex = /^[a-zA-Z][\w_]+$/;
    return usernameRegex.test(value) && value.length >= 3 && value.length <= 15;
};
/**
 * Parse a string into a safe integer, throwing an error if the parsing fails.
 * @param value - The string to be parsed.
 * @returns The parsed integer value.
 */
var parseSafeInt = function (value) {
    var parsedValue = parseInt(value, 10);
    if (Number.isNaN(parsedValue)) {
        throw new Error("Invalid integer: ".concat(value));
    }
    return parsedValue;
};

exports.isValidUsername = isValidUsername;
exports.parseSafeInt = parseSafeInt;
//# sourceMappingURL=index.cjs.map
