import { EventEmitter } from "events";
import { connectionID } from "./../models";
import { connectionEvents } from "./connectionEvents";
import { connectionUtils } from "./connectionUtils";
import { protoAction } from "./protocol.actions";
import { connectionManagerEvents } from "./connections-server";

export interface IConnectionManager {
  config(any);
  listenToConnectionEvent(cid: connectionID, protocolAction: protoAction);
  getConnection(cid: connectionID);
  setConnection(cid: connectionID, connection /*: IConnection*/);
  on(eventType: string, func: Function);
  emit(eventType: string, data);
  _connectionsList: Map<connectionID, any>;
}

// export enum connectionManagerEvents {
//   remoteConnected = "remote-connected",
//   remoteDisconnected = "remote-disconnected"
// }

export abstract class ConnectionManager implements IConnectionManager {
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

  abstract config(conf: any);

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

  reconnectionHandler(connectionSocket) {
    //TODO
    //   this._connectionsList.delete()
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
  }

  /* API for registering connection events using connection ID */
  listenToConnectionEvent(connID: connectionID, protocolAction) {
    const connection = this.getConnection(connID);
    if (!connection) {
      throw new Error(
        `could not find connection with connection id: ${connID}`
      );
    }
    connectionEvents.registerConnectionEvent(connection, protocolAction);
  }

  
}
