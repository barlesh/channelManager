import { AgentsManager } from "./../../../agents-manager/src/agents";
import { EventEmitter } from "events";
import { connectionID } from "./../models";
import { agentsProtocolEvents } from "./../protocol";
import { connectionEvents } from "./connectionEvents";
import { connectionUtils } from "./connection";
import { agentsUtils } from "./agentHandlers";

export interface IConnectionManager {
  config(io, channelName, agentsManager: AgentsManager);
  registerConnectionEvent(cid: connectionID, protocolAction: any);
  getConnection(cid: connectionID);
  on(eventType: string, func: Function);
  emit(eventType: string, data);
}

export enum connectionManagerEvents {
  remoteConnected = "remote-connected",
  remoteDisconnected = "remote-disconnected",
  // agentRegistered = "agent-registration-event",
  // agentUnRegisterd = "agent-un-register-event"
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
  setConnection(cid, connection) {
    this._connectionsList.set(cid, connection);
  }

  getConnection(cid: connectionID) {
    return this._connectionsList.get(cid);
  }

  config(io, channelName) {
    if (!io || !channelName) {
      throw new Error("parameters not supplied");
    }

    this._socketServer = io;
    this._channel = channelName;

    const nsp = `/${channelName}`;
    this._nsp = this._socketServer.of(nsp);
    if (!this._nsp) {
      throw new Error("could not set namespace");
    }

    // register handler for the connection event
    this._nsp.on("connection", this.connectionHandler);
    this._nsp.on("reconnect", this.reconnectionHandler);
  }

  connectionHandler(connectionSocket) {
    let connID;
    console.log(`Received connection. socket: ${connectionSocket}`);
    connID = connectionUtils.extractConnectionID(connectionSocket);
    if (!connID) {
      console.warn("received connection without unique connection ID.");
      return;
    }
    this.setConnection(connID, connectionSocket);
    // notify other manager that new remote connection exist, and publish its ID
    this.emit(connectionManagerEvents.remoteConnected, connID);
  }

  reconnectionHandler(connectionSocket) {
    //TODO
    //   this._connectionsList.delete()
  }

  /* Agent registration LOGIC */
  agentRegistrationHandler(connection, data) {
    const d = agentsUtils.agentRegistrationValidation(connection, data);
    // this.eve.emit(connectionManagerEvents.agentRegistered, d);
  }

  /* Agent unregistration LOGIC */
  agentUnRegistrationHandler(connection, data) {
    const d = agentsUtils.agentUnRegistrationValidation(connection, data);
    // this.eve.emit(connectionManagerEvents.agentUnRegisterd, d);
  }

  // /* Class's LOGIC.  */
  // registerAgentHandlers(connection) {
  //   // bind specific socket to the handlers
  //   const bindedagentRegistrationHandler = this.agentRegistrationHandler.bind(
  //     this,
  //     connection
  //   );
  //   const bindedagentUnRegistrationHandler = this.agentRegistrationHandler.bind(
  //     this,
  //     connection
  //   );
  //   connection.on(
  //     agentsProtocolEvents.agentRegister,
  //     bindedagentRegistrationHandler
  //   );
  //   connection.on(
  //     agentsProtocolEvents.agentUnRegister,
  //     bindedagentUnRegistrationHandler
  //   );
  // }

  /* API for registering connection events using connection ID */
  registerConnectionEvent(
    connID: connectionID,
    protocolAction
  ) {
    const connection = this.getConnection(connID);
    if (!connection) {
      throw new Error(
        `could not find connection with connection id: ${connID}`
      );
    }
    connectionEvents.registerConnectionEvent(connection, protocolAction);
  }
}
