import { ConnectionManager } from "./connections-manager";
import { connectionID } from "../models";
export declare enum connectionClientManagerEvents {
    connectedToRemote = "connected-to-remote",
    disconnectedFromRemote = "disconnected-from-remote",
    remoteDisconnected = "remote-disconnected"
}
export declare class ConnectionClient extends ConnectionManager {
    _serverAddr: any;
    _serverPort: any;
    _connectionID: connectionID;
    connect(): connectionID;
    config(conf: any): void;
    connectToServer(): void;
    registerToListenToRemoteConnections(): void;
    disconnectionHandlerClient(manager: any, Msg: any): void;
    reconnectionHandlerClient(manager: any): void;
    createConnection(): any;
    destroyConnection(): void;
}
