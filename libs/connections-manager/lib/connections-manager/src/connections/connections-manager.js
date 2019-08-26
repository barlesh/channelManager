"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
var connectionManagerEvents;
(function (connectionManagerEvents) {
    connectionManagerEvents["agentRegistered"] = "agent-registration-event";
})(connectionManagerEvents || (connectionManagerEvents = {}));
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
    config(io, channelName, agentsManager) {
        if (!io) {
            throw new Error("no io supplied");
        }
        if (!agentsManager) {
            throw new Error("no agents manager supplied");
        }
        this._socketServer = io;
        this._agents = agentsManager;
        this._channel = channelName;
        const nsp = `/${channelName}`;
        console.log("nps of io: ", nsp);
        this._nsp = this._socketServer.of(nsp);
        if (!this._nsp) {
            throw new Error("could not set namespace");
        }
        this._nsp.on("connection", this.connectionHandler);
    }
    connectionHandler(connectionSocket) {
        let agentID;
        console.log(`Received connection. socket: ${connectionSocket}`);
        if (connectionSocket &&
            connectionSocket.client &&
            connectionSocket.client.id) {
            agentID = connectionSocket.client.id;
            console.log("agentID: ", agentID);
        }
        connectionSocket.on("agent-registration", this.agentRegistrationHandler);
        this._agents.add({ id: agentID });
    }
    agentRegistrationHandler(data) {
        const agentData = data;
        this.eve.emit(connectionManagerEvents.agentRegistered, data);
    }
}
exports.ConnectionManager = ConnectionManager;
