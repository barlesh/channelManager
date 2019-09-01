"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connectionUtils_1 = require("./connectionUtils");
const connections_manager_1 = require("./connections-manager");
var connectionServerManagerEvents;
(function (connectionServerManagerEvents) {
    connectionServerManagerEvents["remoteConnected"] = "remote-connected";
    connectionServerManagerEvents["remoteDisconnected"] = "remote-disconnected";
})(connectionServerManagerEvents = exports.connectionServerManagerEvents || (exports.connectionServerManagerEvents = {}));
class ConnectionServer extends connections_manager_1.ConnectionManager {
    listen() {
        const nsp = `/${this._channel}`;
        console.info(`Connection manager listening on nsp: ${nsp}`);
        this._nsp = this._socketServer.of(nsp);
        if (!this._nsp) {
            throw new Error("could not set namespace");
        }
    }
    config(conf) {
        const io = conf["io"];
        const channelName = conf["channel"];
        if (!io || !channelName) {
            throw new Error("parameters not supplied");
        }
        this._connectionsList = new Map();
        this._socketServer = io;
        this._channel = channelName;
        this.listen();
        this.registerToListenToRemoteConnections();
    }
    registerToListenToRemoteConnections() {
        const bindedconnectionHandler = this.connectionHandlerServer.bind(this, this._nsp);
        const bindeddisconnectionHandler = this.disconnectionHandlerServer.bind(this, this._nsp);
        this._nsp.on("connection", bindedconnectionHandler);
        this._nsp.on("disconnect", bindeddisconnectionHandler);
    }
    connectionHandlerServer(connectionSocket, connection) {
        let connID;
        connID = connectionUtils_1.connectionUtils.extractConnectionClintID(connection);
        console.info("Handling server connection event. connection id: ", connID);
        super.connectionHandler(this, connection);
        this.emit(connectionServerManagerEvents.remoteConnected, connID);
    }
    disconnectionHandlerServer(connectionSocket) {
        let connID;
        connID = connectionUtils_1.connectionUtils.extractConnectionClintID(connectionSocket);
        console.info("Handling disconnection event. connection id: ", connID);
        super.disconnectionHandler(this, connectionSocket);
        this.emit(connectionServerManagerEvents.remoteDisconnected, connID);
    }
}
exports.ConnectionServer = ConnectionServer;
