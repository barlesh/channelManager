import { ConnectionManager } from "./connections-manager";
import { connectionID } from "../models";
import * as uid from "uuid";
import { connectionUtils } from "./connectionUtils";

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
      this._nsp = this._socketServer.connect(addr);
      this._nsp.on("connect", () => {
        clearTimeout(tid);
        resolve(true);
      });

      tid = setTimeout(() => {
        return resolve(false);
      }, 1000);
    });
  }

  async connect(): Promise<connectionID> {
    const serverAddr = `${this._serverAddr}:${this._serverPort}/${this._channel}`;
    console.info(`Connection to server in : ${serverAddr}`);

    const ans = await this.connectAndWaitForConnection(serverAddr);

    if (!ans || !this._nsp || !this._nsp.connected) {
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

  async connectToServer() {
    const cid = await this.connect();
    this.registerToListenToRemoteConnections();
  }

  registerToListenToRemoteConnections() {
    const bindeddisconnectionHandler = this.disconnectionHandlerClient.bind(
      this._nsp,
      this
    );

    const bindedreconnectionHandler = this.reconnectionHandlerClient.bind(
      this._nsp,
      this
    );
    this._nsp.on("disconnect", bindeddisconnectionHandler);
    this._nsp.on("reconnect", bindedreconnectionHandler);
  }

  disconnectionHandlerClient(manager, Msg) {
    console.info(
      "Connection client: Received disconnection event. destroinyg connection."
    );
    manager.destroyConnection();
    manager.emit(connectionClientManagerEvents.remoteDisconnected);
  }

  reconnectionHandlerClient(manager) {
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
