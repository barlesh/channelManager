"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const connectionEvents_1 = require("./connectionEvents");
const connectionUtils_1 = require("./connectionUtils");
class ConnectionManager {
    constructor() {
        this.eve = new events_1.EventEmitter();
    }
    on(eventType, func) {
        this.eve.on(eventType, func);
    }
    emit(eventType, data) {
        this.eve.emit(eventType, data);
    }
    setConnection(cid, connection) {
        this._connectionsList.set(cid, connection);
    }
    destroyConnection(cid) {
        this._connectionsList.delete(cid);
    }
    getConnection(cid) {
        return this._connectionsList.get(cid);
    }
    reconnectionHandler(connectionSocket) {
        console.log("reconnectionHandler: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
    connectionHandler(manager, connectionSocket) {
        let connID;
        connID = connectionUtils_1.connectionUtils.extractConnectionClintID(connectionSocket);
        if (!connID) {
            console.warn("received connection without unique connection ID.");
            return;
        }
        console.info(`Received incoming connection. connection ID: ${connID}`);
        manager.setConnection(connID, connectionSocket);
    }
    disconnectionHandler(manager, connectionSocket) {
        console.log("disconnected handler. connectionSocket: ", connectionSocket);
        let connID;
        connID = connectionUtils_1.connectionUtils.extractConnectionClintID(connectionSocket);
        if (!connID) {
            console.warn("received connection without unique connection ID.");
            return;
        }
        console.info(`Received incoming disconnection. connection ID: ${connID}`);
        manager.destroyConnection(connID);
    }
    subscribeToConnectionEvent(connID, protocolAction) {
        const connection = this.getConnection(connID);
        if (!connection) {
            throw new Error(`could not find connection with connection id: ${connID}`);
        }
        connectionEvents_1.connectionEvents.registerConnectionEvent(connection, protocolAction);
    }
    unsubscribeToConnectionEvent(connID, protocolAction) {
        console.warn("currently not supported");
    }
    publishConnectionEvent(connID, protocolAction, data) {
        const connection = this.getConnection(connID);
        if (!connection) {
            throw new Error(`could not find connection with connection id: ${connID}`);
        }
        connectionEvents_1.connectionEvents.publishConnectionEvent(connection, protocolAction, data);
    }
}
exports.ConnectionManager = ConnectionManager;
