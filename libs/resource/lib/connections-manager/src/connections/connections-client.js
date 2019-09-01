"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connections_manager_1 = require("./connections-manager");
const uid = require("uuid");
var connectionClientManagerEvents;
(function (connectionClientManagerEvents) {
    connectionClientManagerEvents["connectedToRemote"] = "connected-to-remote";
    connectionClientManagerEvents["disconnectedFromRemote"] = "disconnected-from-remote";
    connectionClientManagerEvents["remoteDisconnected"] = "remote-disconnected";
})(connectionClientManagerEvents = exports.connectionClientManagerEvents || (exports.connectionClientManagerEvents = {}));
class ConnectionClient extends connections_manager_1.ConnectionManager {
    connect() {
        const serverAddr = `${this._serverAddr}:${this._serverPort}/${this._channel}`;
        console.info(`Connection to server in : ${serverAddr}`);
        this._nsp = this._socketServer.connect(serverAddr, {
            "reconnection delay": 0,
            "reopen delay": 0,
            "force new connection": true
        });
        if (!this._nsp) {
            throw new Error("could not connect to server");
        }
        const connID = this.createConnection();
        return connID;
    }
    config(conf) {
        const io = conf["io"];
        const channelName = conf["channel"];
        const serverAddr = conf["address"];
        const serverPort = conf["port"];
        if (!io || !channelName || !serverAddr || !serverPort) {
            throw new Error("parameters not supplied");
        }
        this._connectionsList = new Map();
        this._socketServer = io;
        this._channel = channelName;
        this._serverAddr = serverAddr;
        this._serverPort = serverPort;
    }
    connectToServer() {
        const cid = this.connect();
        this.registerToListenToRemoteConnections();
    }
    registerToListenToRemoteConnections() {
        const bindeddisconnectionHandler = this.disconnectionHandlerClient.bind(this._nsp, this);
        const bindedreconnectionHandler = this.reconnectionHandlerClient.bind(this._nsp, this);
        this._nsp.on("disconnect", bindeddisconnectionHandler);
        this._nsp.on("reconnect", bindedreconnectionHandler);
    }
    disconnectionHandlerClient(manager, Msg) {
        console.info("Connection client: Received disconnection event. destroinyg connection.");
        manager.destroyConnection();
        manager.emit(connectionClientManagerEvents.remoteDisconnected);
    }
    reconnectionHandlerClient(manager) {
        console.log("Connection client: Received disconnection event. re-creating connection.");
        manager.createConnection();
    }
    createConnection() {
        const connID = uid();
        this._connectionID = connID;
        this.setConnection(connID, this._nsp);
        this.emit(connectionClientManagerEvents.connectedToRemote, connID);
        return connID;
    }
    destroyConnection() {
        this._connectionsList.delete(this._connectionID);
    }
}
exports.ConnectionClient = ConnectionClient;
