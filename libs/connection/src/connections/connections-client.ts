import { ConnectionManager } from "./connections-manager";
import { connectionID } from "../models";
import * as uid from "uuid";
import { connectionEvents } from "./connectionEvents";

export enum connectionClientManagerEvents {
  connectedToRemote = "connected-to-remote",
  disconnectedFromRemote = "disconnected-from-remote",
  remoteDisconnected = "remote-disconnected"
}

export class ConnectionClient extends ConnectionManager {
  _serverAddr;
  _serverPort;
  _connectionID: connectionID;

  async connectAndWaitForConnection(addr): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let tid;
      // console.log(`connecting to server: ${addr}`);
      this._nsp = this._socketServer.connect(addr);
      connectionEvents.registerEventNoDup(this._nsp, "connect", () => {
        // console.log(`connected succesfully.`);
        clearTimeout(tid);
        resolve(true);
      });

      tid = setTimeout(() => {
        // console.warn("Timeout expired after connection attampt");
        return resolve(false);
      }, 1000);
    });
  }

  async connect(): Promise<connectionID> {
    const serverAddr = `${this._serverAddr}:${this._serverPort}/${this._channel}`;
    // console.info(`Connection to server in : ${serverAddr}`);
    const ATTAMPTS = 10;
    // try to connect for ATTAMPS times
    for(let i = 1; i<=ATTAMPTS; i++){
      const ans = await this.connectAndWaitForConnection(serverAddr);
      if (ans && this._nsp && this._nsp.connected) {
        const connID = this.createConnection();
        console.info(`Successfuly connected to ${serverAddr}. attampt ${i}`);
        return connID;
      } 
    }

    // console.error("could not connect to server");
    throw new Error("could not connect to server");
  }

  config(conf) {
    if (!conf) {
      // console.error(
      //   "no configuration object supplied. cannot configure connection client"
      // );
      throw new Error("can not configure connection client");
    }
    // // console.debug("configuring connection client. configuration: ", conf);
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

  async connectToServer() {
    const cid = await this.connect();
    this.registerToListenToRemoteConnections();
  }

  registerToListenToRemoteConnections() {
    // console.log("registering disconnection & reconnect handlers.");
    const bindeddisconnectionHandler = this.disconnectionHandlerClient.bind(
      this._nsp,
      this
    );

    const bindedreconnectionHandler = this.reconnectionHandlerClient.bind(
      this._nsp,
      this
    );
    connectionEvents.registerEventNoDup(
      this._nsp,
      "disconnect",
      bindeddisconnectionHandler
    );
    connectionEvents.registerEventNoDup(
      this._nsp,
      "reconnect",
      bindedreconnectionHandler
    );
  }

  disconnectionHandlerClient(manager, Msg) {
    console.info("Received disconnection event. destroinyg connection.");
    manager.destroyConnection();
    manager.emit(connectionClientManagerEvents.remoteDisconnected);
  }

  reconnectionHandlerClient(manager) {
    // console.info("Received re-connection event. re-creating connection.");
    manager.createConnection();
  }

  createConnection() {
    // the connection id does not relay on the connection object. it is single for connection client (unlike connection server)
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
