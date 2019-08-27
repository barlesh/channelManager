import { EventEmitter } from "events";
import { connectionID } from "./../models";
import { connectionEvents } from "./connectionEvents";
import { connectionUtils } from "./connectionUtils";
import { agentsUtils } from "./agentHandlers";
import { protoAction } from "./protocol.actions";

export interface IConnectionManager {
  config(io, channelName: string);
  registerConnectionEvent(cid: connectionID, protocolAction: protoAction);
  getConnection(cid: connectionID);
  setConnection(cid: connectionID, connection /*: IConnection*/);
  on(eventType: string, func: Function);
  emit(eventType: string, data);
  _connectionsList: Map<connectionID, any>;
}

export enum connectionManagerEvents {
  remoteConnected = "remote-connected",
  remoteDisconnected = "remote-disconnected"
}

export class ConnectionManager implements IConnectionManager {
  _nsp;
  _socketServer;
  _channel: string;
  _connectionsList: Map<connectionID, any>;

  eve = new EventEmitter();

  on(eventType: connectionManagerEvents, func) {
    this.eve.on(eventType, func);
  }

  emit(eventType: connectionManagerEvents, data) {
    this.eve.emit(eventType, data);
  }

  // getters & setters
  setConnection(cid: connectionID, connection) {
    this._connectionsList.set(cid, connection);
  }

  destroyConnection(cid: connectionID) {
    this._connectionsList.delete(cid);
  }

  getConnection(cid: connectionID) {
    return this._connectionsList.get(cid);
  }

  config(io, channelName) {
    if (!io || !channelName) {
      throw new Error("parameters not supplied");
    }

    this._connectionsList = new Map();
    this._socketServer = io;
    this._channel = channelName;

    const nsp = `/${channelName}`;
    console.info(`Connection manager listening on nsp: ${nsp}`);
    this._nsp = this._socketServer.of(nsp);
    if (!this._nsp) {
      throw new Error("could not set namespace");
    }

    // console.log("connection manager, socket: ", this._nsp);

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

  connectionHandler(manager, connectionSocket) {
    let connID;
    connID = connectionUtils.extractConnectionID(connectionSocket);
    if (!connID) {
      console.warn("received connection without unique connection ID.");
      return;
    }
    console.info(`Received incoming connection. connection ID: ${connID}`);
    manager.setConnection(connID, connectionSocket);
    // notify other manager that new remote connection exist, and publish its ID
    manager.emit(connectionManagerEvents.remoteConnected, connID);
  }

  reconnectionHandler(connectionSocket) {
    //TODO
    //   this._connectionsList.delete()
  }

  disconnectionHandler(manager: ConnectionManager, connectionSocket){
    let connID;
    connID = connectionUtils.extractConnectionID(connectionSocket);
    if (!connID) {
      console.warn("received connection without unique connection ID.");
      return;
    }
    console.info(`Received incoming disconnection. connection ID: ${connID}`);
    manager.destroyConnection(connID);
    // notify other manager that new remote connection exist, and publish its ID
    manager.emit(connectionManagerEvents.remoteDisconnected, connID);
  }

  /* API for registering connection events using connection ID */
  registerConnectionEvent(connID: connectionID, protocolAction) {
    const connection = this.getConnection(connID);
    if (!connection) {
      throw new Error(
        `could not find connection with connection id: ${connID}`
      );
    }
    connectionEvents.registerConnectionEvent(connection, protocolAction);
  }
}
