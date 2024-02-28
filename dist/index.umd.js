/*!
 * prest-client v0.0.2
 * (c) pgEdge
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.prestClient = {}));
})(this, (function (exports) { 'use strict';

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

}));
//# sourceMappingURL=index.umd.js.map
