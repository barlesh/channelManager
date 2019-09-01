"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connectionUtils;
(function (connectionUtils) {
    function extractConnectionClintID(connection) {
        if (connection && connection.client && connection.client.id) {
            return connection.client.id;
        }
        console.warn(`could not extract connection id from connection.`);
        return undefined;
    }
    connectionUtils.extractConnectionClintID = extractConnectionClintID;
})(connectionUtils = exports.connectionUtils || (exports.connectionUtils = {}));
