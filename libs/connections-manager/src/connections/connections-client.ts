import { connectionUtils } from "./connectionUtils";
import { ConnectionManager } from "./connections-manager";

export class ConnectionClient extends ConnectionManager {
  _serverAddr;
  _serverPort;

  connect() {
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

    const connID = connectionUtils.extractConnectionID(this._nsp);
    this.setConnection(connID, this._nsp);
  }

  config(io, channelName) {
    if (!io || !channelName) {
      throw new Error("parameters not supplied");
    }

    this._connectionsList = new Map();
    this._socketServer = io;
    this._channel = channelName;

    this.connect();
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
