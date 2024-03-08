/*!
 * prest-client v0.0.6
 * (c) pgEdge
 * Released under the MIT License.
 */

'use strict';

var querystring = require('querystring');

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

var ChainedQuery = /** @class */ (function () {
    function ChainedQuery(client, baseUrl, reqType, body) {
        this.client = client;
        this.baseUrl = baseUrl;
        this.reqType = reqType;
        this.body = body;
        this.chainedOperations = [];
    }
    ChainedQuery.prototype.Page = function (pageNumber) {
        this.chainedOperations.push(querystring.stringify({ _page: pageNumber }));
        return this;
    };
    ChainedQuery.prototype.PageSize = function (pageSize) {
        this.chainedOperations.push(querystring.stringify({ _page_size: pageSize }));
        return this;
    };
    ChainedQuery.prototype.Select = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        this.chainedOperations.push(querystring.stringify({ _select: fields.join(',') }));
        return this;
    };
    ChainedQuery.prototype.Count = function (field) {
        var fieldValue = field ? field : '*';
        this.chainedOperations.push(querystring.stringify({ _count: fieldValue }));
        return this;
    };
    ChainedQuery.prototype.CountFirst = function (countFirst) {
        if (countFirst === void 0) { countFirst = true; }
        this.chainedOperations.push(querystring.stringify({ _count_first: countFirst }));
        return this;
    };
    ChainedQuery.prototype.Distinct = function (distinct) {
        if (distinct === void 0) { distinct = true; }
        this.chainedOperations.push(querystring.stringify({ _distinct: distinct }));
        return this;
    };
    ChainedQuery.prototype.Order = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        var orderFields = fields.map(function (field) {
            return field.startsWith('-') ? field : "+".concat(field);
        });
        this.chainedOperations.push(querystring.stringify({ _order: orderFields.join(',') }));
        return this;
    };
    ChainedQuery.prototype.GroupBy = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        this.chainedOperations.push(querystring.stringify({ _groupby: fields.join(',') }));
        return this;
    };
    ChainedQuery.prototype.FilterEqual = function (field, value) {
        this.chainedOperations.push("".concat(field, "=").concat(encodeURIComponent(value)));
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
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        httpClientMethod = this.client.getHttpClientMethod(this.reqType);
                        return [4 /*yield*/, httpClientMethod(chainedUrl, this.body)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
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
    PrestApiClient.prototype.Table = function (tableName) {
        var _this = this;
        if (!this.client) {
            throw new Error('Client not initialized');
        }
        if (!tableName) {
            throw new Error('Table name is required');
        }
        var schemaName = 'public';
        if (tableName.includes('.')) {
            var parts = tableName.split('.');
            schemaName = parts[0] || schemaName;
            tableName = parts[1];
        }
        return {
            List: function () {
                var baseUrl = "".concat(_this.base_url, "/").concat(_this.database, "/").concat(schemaName, "/").concat(tableName);
                return new ChainedQuery(_this, baseUrl, 'get', null);
            },
            Show: function () {
                var baseUrl = "".concat(_this.base_url, "/show/").concat(_this.database, "/").concat(schemaName, "/").concat(tableName);
                return new ChainedQuery(_this, baseUrl, 'get', null);
            },
            Insert: function (data) {
                var baseUrl = "".concat(_this.base_url, "/").concat(_this.database, "/").concat(schemaName, "/").concat(tableName);
                return new ChainedQuery(_this, baseUrl, 'post', data);
            },
            Update: function (data) {
                var baseUrl = "".concat(_this.base_url, "/").concat(_this.database, "/").concat(schemaName, "/").concat(tableName);
                return new ChainedQuery(_this, baseUrl, 'put', data);
            },
            Delete: function () {
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

exports.PrestApiClient = PrestApiClient;
//# sourceMappingURL=index.js.map
