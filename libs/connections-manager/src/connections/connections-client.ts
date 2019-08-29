import { ConnectionManager } from "./connections-manager";
import { connectionID } from "../models";
import * as uid from "uuid";


export enum connectionClientManagerEvents {
  connectedToRemote = "connected-to-remote",
  disconnectedFromRemote = "disconnected-from-remote"
}

export class ConnectionClient extends ConnectionManager {
  _serverAddr;
  _serverPort;

  connect() : connectionID{
    const serverAddr = `${this._serverAddr}:${this._serverPort}/${
      this._channel
    }`;
    console.info(`Connection to server in : ${serverAddr}`);

    this._nsp = this._socketServer.connect(serverAddr, {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true
      // transports: ["websocket"]
    });

    if (!this._nsp) {
      throw new Error("could not connect to server");
    }

    // the connection id does not relay on the connection object. it is single for connection client (unlike connection server)
    const connID = uid(); //connectionUtils.extractConnectionID(this._nsp);
    this.setConnection(connID, this._nsp);
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
    console.log(`connection manager client. connected to server. cid: ${cid}`)
    this.emit(connectionClientManagerEvents.connectedToRemote, cid);
    this.registerToListenToRemoteConnections();
  }

  registerToListenToRemoteConnections() {
    const bindeddisconnectionHandler = this.disconnectionHandler.bind(
      this._nsp,
      this
    );

    const bindedreconnectionHandler = this.reconnectionHandler.bind(
      this._nsp,
      this
    );
    this._nsp.on("disconnect", bindeddisconnectionHandler);
    this._nsp.on("reconnect", bindedreconnectionHandler);
  }
}
