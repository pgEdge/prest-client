/*!
 * prest-client v0.1.1
 * (c) pgEdge
 * Released under the MIT License.
 */

import { stringify } from 'querystring';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * A class that represents a chained query for interacting with a Prest API endpoint.
 *
 * This class allows you to build up a query by chaining various filter, function, and order methods.
 * Once the query is complete, you can call the `execute` method to execute the query and retrieve the results.
 */
var ChainedQuery = /** @class */ (function () {
    /**
     * Creates a new ChainedQuery instance.
     *
     * @param client - The Prest API client to use for making the request.
     * @param baseUrl - The base URL of the Prest API endpoint.
     * @param reqType - The HTTP request type ('get', 'post', 'put', or 'delete').
     * @param body - The data to send in the request body (for POST and PUT requests).
     */
    function ChainedQuery(client, baseUrl, reqType, body) {
        this.rendererArg = 'json';
        this.sqlFunctions = [];
        this.client = client;
        this.baseUrl = baseUrl;
        this.reqType = reqType;
        this.body = body;
        this.chainedOperations = [];
    }
    /**
     * Adds a page filter to the query, specifying which page of results to retrieve.
     *
     * This is useful for paginating large datasets.
     * Prest API uses a zero-based indexing for pages, where the first page is `_page=0`.
     *
     * @param pageNumber - The page number (zero-based) to retrieve.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve the second page (10 items per page) of products
     * const query = client.table('products').list()
     *   .page(1)
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.page = function (pageNumber) {
        this.chainedOperations.push(stringify({ _page: pageNumber }));
        return this;
    };
    /**
     * Adds a page size filter to the query, specifying the number of items to retrieve per page.
     *
     * This is useful in conjunction with `page` to control how many results are returned at a time.
     *
     * @param pageSize - The number of items per page.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve the first page (10 items per page) of customers
     * const query = client.table('customers').list()
     *   .pageSize(10)
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.pageSize = function (pageSize) {
        this.chainedOperations.push(stringify({ _page_size: pageSize }));
        return this;
    };
    /**
     * Adds a select filter to the query, specifying which fields to retrieve from the results.
     *
     * By default, all fields are returned. Use this method to limit the response to only the fields you need.
     *
     * @param ...fields - A list of field names to select.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve only the 'id', 'name', and 'price' fields from products
     * const query = client.table('products').list()
     *   .select('id', 'name', 'price')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.select = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        this.chainedOperations.push(stringify({ _select: fields.join(',') }));
        return this;
    };
    /**
     * Adds a count filter to the query, which returns the total number of rows in the table.
     *
     * This is useful for getting the overall count of items without retrieving all results. You can optionally specify
     * a field to count. By default, all fields (`*`) are counted.
     *
     * @param field - The field to count (optional, defaults to '*').
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Count the total number of products
     * const query = client.table('products')
     *   .count()
     *   .execute();
     *
     * // Count the number of active users
     * const query = client.table('users')
     *   .count('is_active')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.count = function (field) {
        var fieldValue = field ? field : '*';
        this.chainedOperations.push(stringify({ _count: fieldValue }));
        return this;
    };
    /**
     * Adds a count_first filter to the query, which returns either the first row or the total count.
     *
     * This is useful for checking if there are any results or retrieving the first row quickly.
     *
     * @param countFirst - A boolean value indicating whether to return the first row (true) or the total count (false).
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Check if there are any active orders
     * const query = client.table('orders')
     *   .countFirst(true)
     *   .execute();
     *
     * // Retrieve the first product
     * const query = client.table('products')
     *   .countFirst()
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.countFirst = function (countFirst) {
        if (countFirst === void 0) { countFirst = true; }
        this.chainedOperations.push(stringify({ _count_first: countFirst }));
        return this;
    };
    /**
     * Sets the output renderer for the query results ('json' or 'xml').
     *
     * By default, the response is formatted as JSON. Use this method to specify XML instead.
     *
     * @param rendererArg - The desired output renderer ('json' or 'xml').
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve products in XML format
     * const query = client.table('products')
     *   .renderer('xml')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.renderer = function (rendererArg) {
        this.chainedOperations.push(stringify({ _renderer: rendererArg }));
        this.rendererArg = rendererArg;
        return this;
    };
    /**
     * Adds a distinct filter to the query, which removes duplicate rows from the result set.
     *
     * This is useful when you want to retrieve unique values from a column or combination of columns.
     *
     * @param distinct - A boolean value indicating whether to apply distinct filtering (true) or not (false).
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve distinct product categories
     * const query = client.table('products').list()
     *   .distinct(true)
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.distinct = function (distinct) {
        if (distinct === void 0) { distinct = true; }
        this.chainedOperations.push(stringify({ _distinct: distinct }));
        return this;
    };
    /**
     * Adds an order filter to the query, specifying the order in which the results should be returned.
     *
     * Use a minus sign (-) prefix to indicate descending order for a field.
     *
     * @param ...fields - A list of field names to order by. Prefix field names with '-' for descending order.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve products ordered by price in descending order
     * const query = client.table('products').list()
     *   .order('-price')
     *   .execute();
     *
     * // Retrieve products ordered by price in ascending order, then by name in descending order
     * const query = client.table('products').list()
     *   .order('price', '-name')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.order = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        var orderFields = fields.map(function (field) {
            return field.startsWith('-') ? field : "".concat(field);
        });
        this.chainedOperations.push(stringify({ _order: orderFields.join(',') }));
        return this;
    };
    /**
     * Adds a group by filter to the query, grouping the results based on the specified fields.
     *
     * This is useful when you want to perform aggregate functions (such as SUM, AVG, etc.) on grouped data.
     *
     * @param ...fields - A list of field names to group by.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve total sales amount grouped by product category
     * const query = client.table('sales').list()
     *   .groupBy('product_category')
     *   .sum('sales_amount')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.groupBy = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        this.chainedOperations.push(stringify({ _groupby: fields.join(',') }));
        return this;
    };
    /**
     * Adds an equal filter to the query, specifying that a field must be equal to a certain value.
     *
     * @param field - The field to filter by.
     * @param value - The value that the field must be equal to.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve products with the 'category' field equal to 'electronics'
     * const query = client.table('products').list()
     *   .filterEqual('category', 'electronics')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.filterEqual = function (field, value) {
        this.chainedOperations.push("".concat(field, "=").concat(encodeURIComponent(value)));
        return this;
    };
    /**
     * Adds a Sum function to the query, calculating the sum of values in the specified field.
     *
     * This is useful when you want to aggregate numerical values across grouped data.
     *
     * @param field - The field for which to calculate the sum.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve the sum of category IDs grouped by category
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .sum('category_id')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.sum = function (field) {
        this.sqlFunctions.push("sum:".concat(field));
        return this;
    };
    /**
     * Adds an Avg function to the query, calculating the average of values in the specified field.
     *
     * This is useful when you want to find the average value of a numerical field across grouped data.
     *
     * @param field - The field for which to calculate the average.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve the average of category IDs grouped by category
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .avg('category_id')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.avg = function (field) {
        this.sqlFunctions.push("avg:".concat(field));
        return this;
    };
    /**
     * Adds a Max function to the query, finding the maximum value in the specified field.
     *
     * This is useful when you want to find the maximum value of a field across grouped data.
     *
     * @param field - The field for which to find the maximum value.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve the maximum category ID grouped by category
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .max('category_id')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.max = function (field) {
        this.sqlFunctions.push("max:".concat(field));
        return this;
    };
    /**
     * Adds a Min function to the query, finding the minimum value in the specified field.
     *
     * This is useful when you want to find the minimum value of a field across grouped data.
     *
     * @param field - The field for which to find the minimum value.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve the minimum category ID grouped by category
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .min('category_id')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.min = function (field) {
        this.sqlFunctions.push("min:".concat(field));
        return this;
    };
    /**
     * Adds a StdDev function to the query, calculating the standard deviation of values in the specified field.
     *
     * This is useful when you want to analyze the variability of numerical data across grouped data.
     *
     * @param field - The field for which to calculate the standard deviation.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve the standard deviation of category IDs grouped by category
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .stdDev('category_id')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.stdDev = function (field) {
        this.sqlFunctions.push("stddev:".concat(field));
        return this;
    };
    /**
     * Adds a Variance function to the query, calculating the variance of values in the specified field.
     *
     * This is useful when you want to measure the spread or dispersion of numerical data across grouped data.
     *
     * @param field - The field for which to calculate the variance.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve the variance of category IDs grouped by category
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .variance('category_id')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.variance = function (field) {
        this.sqlFunctions.push("variance:".concat(field));
        return this;
    };
    /**
     * Adds a having filter to the query, specifying a condition for aggregated values after grouping.
     *
     * This is useful when you want to filter grouped results based on aggregated values.
     *
     * @param groupFunc - The aggregation function to apply the condition to (e.g., 'sum', 'avg', 'min', 'max', etc.).
     * @param field - The field to which the condition applies.
     * @param condition - The condition operator (e.g., '$gt', '$lt', '$eq', etc.).
     * @param value - The value to compare against.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve categories where the sum of category IDs is greater than 5
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .sum('category_id')
     *   .having('sum', 'category_id', '$gt', 5)
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.having = function (groupFunc, field, condition, value) {
        var havingClause = "having:".concat(groupFunc, ":").concat(field, ":").concat(condition, ":").concat(encodeURIComponent(value));
        this.chainedOperations.push(havingClause);
        return this;
    };
    /**
     * Filters results based on a field being within a specific range.
     *
     * @param field The name of the field to filter on.
     * @param start (optional) The lower bound of the range (inclusive).
     * @param end (optional) The upper bound of the range (inclusive).
     * @returns A chained query object for further building the query.
     *
     * @example
     * ```typescript
     * // Filter categories where 'category_id' is between 200 and 300 (inclusive)
     * const response = await client
     *   .table('categories')
     *   .list()
     *   .filterRange('category_id', 200, 300)
     *   .execute();
     * ```
     *
     * @example
     * // Filter categories where 'category_id' is greater than or equal to 200
     * const response = await client
     *   .table('categories')
     *   .list()
     *   .filterRange('category_id', 200)
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.filterRange = function (field, start, end) {
        if (start !== undefined) {
            this.chainedOperations.push("".concat(field, "=$gte.").concat(encodeURIComponent(start)));
        }
        if (end !== undefined) {
            this.chainedOperations.push("".concat(field, "=$lte.").concat(encodeURIComponent(end)));
        }
        return this;
    };
    /**
     * Performs a join between tables.
     *
     * @param type The type of join to perform (e.g., 'inner', 'left', 'right').
     * @param table The name of the table to join with.
     * @param leftField The field name from the current table.
     * @param operator The comparison operator to use (e.g., '$eq', '$gt', '$lt').
     * @param rightField The field name from the joined table.
     * @returns A chained query object for further building the query.
     *
     * @example
     * ```typescript
     * // Perform an inner join between 'categories' and 'products' tables
     * const response = await client
     *   .table('categories')
     *   .list()
     *   .join(
     *     'inner',
     *     'products',
     *     'categories.category_id',
     *     '$eq',
     *     'products.category_id',
     *   )
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.join = function (joinType, jointable, localField, operator, foreignField) {
        var joinClause = "_join=".concat(joinType, ":").concat(jointable, ":").concat(localField, ":").concat(operator, ":").concat(foreignField);
        this.chainedOperations.push(joinClause);
        return this;
    };
    /**
     * Filters results based on a JSON field using a JSONB path expression.
     *
     * @param field The name of the JSON field to filter on.
     * @param path The JSONB path expression to use for filtering.
     * @param value The value to compare against the path in the JSON field.
     * @returns A chained query object for further building the query.
     *
     * @example
     * ```typescript
     * // Assuming a 'mock_json' table with a 'jsonb_data' field containing JSON data
     * const response = await client
     *   .table('mock_json')
     *   .list()
     *   .jsonbFilter('jsonb_data', 'tags', 1)
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.jsonbFilter = function (field, jsonField, value) {
        var filterClause = "".concat(field, "->>").concat(jsonField, ":jsonb=").concat(encodeURIComponent(value));
        this.chainedOperations.push(filterClause);
        return this;
    };
    /**
     * Adds a full-text search filter to the query using tsquery syntax.
     *
     * @param field - The field to perform the text search on.
     * @param query - The tsquery string representing the search query.
     * @param language - The language to tokenize the query in (optional).
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Perform a full-text search for documents containing 'fat' and 'rat'
     * const query = client.table('documents').list()
     *   .textSearch('content', 'fat & rat')
     *   .execute();
     *
     * // Perform a full-text search in Portuguese language for documents containing 'gato' and 'cão'
     * const query = client.table('documents').list()
     *   .textSearch('content', 'gato & cão', 'portuguese')
     *   .execute();
     * ```
     */
    ChainedQuery.prototype.textSearch = function (field, query, language) {
        var tsQuery = "".concat(field).concat(language ? '$' + language : '', ":tsquery=").concat(encodeURIComponent(query));
        this.chainedOperations.push(tsQuery);
        return this;
    };
    /**
     * Executes the chained query operations and returns the result.
     *
     * @returns A promise that resolves with the query result.
     */
    ChainedQuery.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chainedUrl, i, httpClientMethod, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainedUrl = this.baseUrl;
                        if (this.chainedOperations.length > 0) {
                            chainedUrl += "?".concat(this.chainedOperations[0]);
                            for (i = 1; i < this.chainedOperations.length; i++) {
                                chainedUrl += "&".concat(this.chainedOperations[i]);
                            }
                        }
                        if (this.sqlFunctions.length > 0) {
                            chainedUrl += "&_select=".concat(this.sqlFunctions.join(','));
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log(chainedUrl);
                        httpClientMethod = this.client.getHttpClientMethod(this.reqType);
                        return [4 /*yield*/, httpClientMethod(chainedUrl, this.body)];
                    case 2:
                        response = _a.sent();
                        if (this.rendererArg === 'json') {
                            return [2 /*return*/, response.json()];
                        }
                        else {
                            return [2 /*return*/, response.text()];
                        }
                    case 3:
                        error_1 = _a.sent();
                        throw new Error("Failed to make API request: ".concat(error_1.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ChainedQuery;
}());
/**
 * A client for interacting with a Prest API.
 *
 * @export
 * @class PrestApiClient
 */
var PrestApiClient = /** @class */ (function () {
    /**
     * Creates a new Prest API client with the provided options.
     *
     * @param options - The options for creating the client.
     */
    function PrestApiClient(options) {
        this.options = options;
        this.createClient();
    }
    /**
     * Creates the underlying HTTP client with the necessary authentication headers.
     */
    PrestApiClient.prototype.createClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var username, password, authHeader_1;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    username = this.options.user_name;
                    password = this.options.password;
                    authHeader_1 = 'Basic ' + btoa(username + ':' + password);
                    this.client = {
                        get: function (url) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch(url, {
                                            headers: {
                                                Authorization: authHeader_1,
                                            },
                                        })];
                                    case 1:
                                        response = _a.sent();
                                        if (!response.ok) {
                                            throw new Error("Failed to fetch data: ".concat(response.statusText));
                                        }
                                        return [2 /*return*/, response];
                                }
                            });
                        }); },
                        post: function (url, body) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch(url, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': authHeader_1,
                                            },
                                            body: JSON.stringify(body),
                                        })];
                                    case 1:
                                        response = _a.sent();
                                        if (!response.ok) {
                                            throw new Error("Failed to insert data: ".concat(response.statusText));
                                        }
                                        return [2 /*return*/, response];
                                }
                            });
                        }); },
                        put: function (url, body) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch(url, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': authHeader_1,
                                            },
                                            body: JSON.stringify(body),
                                        })];
                                    case 1:
                                        response = _a.sent();
                                        if (!response.ok) {
                                            throw new Error("Failed to update data: ".concat(response.statusText));
                                        }
                                        return [2 /*return*/, response];
                                }
                            });
                        }); },
                        delete: function (url) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch(url, {
                                            method: 'DELETE',
                                            headers: {
                                                Authorization: authHeader_1,
                                            },
                                        })];
                                    case 1:
                                        response = _a.sent();
                                        if (!response.ok) {
                                            throw new Error("Failed to delete data: ".concat(response.statusText));
                                        }
                                        return [2 /*return*/, response];
                                }
                            });
                        }); },
                    };
                }
                catch (error) {
                    console.error('Error creating client:', error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Returns the appropriate HTTP client method for making the API request.
     *
     * @param method - The HTTP method to use ('get', 'post', 'put', or 'delete').
     * @returns The corresponding HTTP client method.
     * @throws An error if the client is not initialized or the method is invalid.
     */
    PrestApiClient.prototype.getHttpClientMethod = function (method) {
        if (!this.client) {
            throw new Error('Client not initialized');
        }
        switch (method) {
            case 'get':
                return this.client.get;
            case 'post':
                return this.client.post;
            case 'put':
                return this.client.put;
            case 'delete':
                return this.client.delete;
            default:
                throw new Error('Invalid HTTP method');
        }
    };
    /**
     * Returns an object for interacting with a specific table in the database.
     *
     * @param tableName - The name of the table.
     * @returns An object with methods for interacting with the table.
     */
    PrestApiClient.prototype.table = function (tableName) {
        var _this = this;
        if (!this.client) {
            throw new Error('Client not initialized');
        }
        if (!tableName) {
            throw new Error('table name is required');
        }
        var schemaName = 'public';
        if (tableName.includes('.')) {
            var parts = tableName.split('.');
            schemaName = parts[0] || schemaName;
            tableName = parts[1];
        }
        return {
            list: function () {
                var baseUrl = "".concat(_this.base_url, "/").concat(_this.database, "/").concat(schemaName, "/").concat(tableName);
                return new ChainedQuery(_this, baseUrl, 'get', null);
            },
            show: function () {
                var baseUrl = "".concat(_this.base_url, "/show/").concat(_this.database, "/").concat(schemaName, "/").concat(tableName);
                return new ChainedQuery(_this, baseUrl, 'get', null);
            },
            insert: function (data) {
                var baseUrl = "".concat(_this.base_url, "/").concat(_this.database, "/").concat(schemaName, "/").concat(tableName);
                return new ChainedQuery(_this, baseUrl, 'post', data);
            },
            batchInsert: function (data) {
                var baseUrl = "".concat(_this.base_url, "/batch/").concat(_this.database, "/").concat(schemaName, "/").concat(tableName);
                return new ChainedQuery(_this, baseUrl, 'post', data);
            },
            update: function (data) {
                var baseUrl = "".concat(_this.base_url, "/").concat(_this.database, "/").concat(schemaName, "/").concat(tableName);
                return new ChainedQuery(_this, baseUrl, 'put', data);
            },
            delete: function () {
                var baseUrl = "".concat(_this.base_url, "/").concat(_this.database, "/").concat(schemaName, "/").concat(tableName);
                return new ChainedQuery(_this, baseUrl, 'delete', null);
            },
        };
    };
    Object.defineProperty(PrestApiClient.prototype, "database", {
        /**
         * Gets the name of the database to which the client is connected.
         */
        get: function () {
            return this.options.database;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PrestApiClient.prototype, "base_url", {
        /**
         * Gets the base URL of the Prest API endpoint to which the client is connected.
         */
        get: function () {
            return this.options.base_url;
        },
        enumerable: false,
        configurable: true
    });
    return PrestApiClient;
}());

export { PrestApiClient };
//# sourceMappingURL=index.mjs.map
