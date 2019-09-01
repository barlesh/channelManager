import { connectionID } from "../models";
import { ConnectionManager } from "./connections-manager";
export declare enum connectionServerManagerEvents {
    remoteConnected = "remote-connected",
    remoteDisconnected = "remote-disconnected"
}
export declare class ConnectionServer extends ConnectionManager {
    _nsp: any;
    _socketServer: any;
    _channel: string;
    _connectionsList: Map<connectionID, any>;
    listen(): void;
    config(conf: any): void;
    registerToListenToRemoteConnections(): void;
    connectionHandlerServer(connectionSocket: any, connection: any): void;
    disconnectionHandlerServer(connectionSocket: any): void;
}
