import { EventEmitter } from "events";
import { connectionID } from "../models";
import { connectionUtils } from "./connectionUtils";
import { ConnectionManager } from "./connections-manager";

export enum connectionServerManagerEvents {
  remoteConnected = "remote-connected",
  remoteDisconnected = "remote-disconnected"
}

export class ConnectionServer extends ConnectionManager {
  _nsp;
  _socketServer;
  _channel: string;
  _connectionsList: Map<connectionID, any>;

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
    // register handler for the connection event
    const bindedconnectionHandler = this.connectionHandler.bind(
      this._nsp,
      this
    );

    const bindeddisconnectionHandler = this.disconnectionHandler.bind(
      this._nsp,
      this
    );

    const bindedreconnectionHandler = this.reconnectionHandler.bind(
      this._nsp,
      this
    );
    this._nsp.on("connection", bindedconnectionHandler);
    this._nsp.on("disconnect", bindeddisconnectionHandler);
    this._nsp.on("reconnect", bindedreconnectionHandler);
  }

  connectionHandler(manager: ConnectionServer, connectionSocket) {
    let connID;
    connID = connectionUtils.extractConnectionID(connectionSocket);
    // TODO change super's mathode to get ID //TODO
    super.connectionHandler(manager, connectionSocket);
    // notify other manager that new remote connection exist, and publish its ID
    manager.emit(connectionServerManagerEvents.remoteConnected, connID);
  }

  disconnectionHandler(manager: ConnectionServer, connectionSocket) {
    let connID;
    connID = connectionUtils.extractConnectionID(connectionSocket);
    // TODO change super's mathode to get ID //TODO
    super.disconnectionHandler(manager, connectionSocket);
    manager.emit(connectionServerManagerEvents.remoteDisconnected, connID);
  }
}
