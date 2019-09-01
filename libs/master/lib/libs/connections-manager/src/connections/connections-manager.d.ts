/// <reference types="node" />
import { EventEmitter } from "events";
import { connectionID } from "./../models";
import { protoActionResponse, protoActionRequest } from "./../../../protocol/src/actions";
export interface IConnectionManager {
    _connectionsList: Map<connectionID, any>;
    config(any: any): any;
    subscribeToConnectionEvent(cid: connectionID, action: protoActionResponse): any;
    unsubscribeToConnectionEvent(cid: connectionID, action: protoActionResponse): any;
    publishConnectionEvent(cid: connectionID, action: protoActionRequest, data: any): any;
    getConnection(cid: connectionID): any;
    setConnection(cid: connectionID, connection: any): any;
    on(eventType: string, func: Function): any;
    emit(eventType: string, data?: any): any;
}
export declare abstract class ConnectionManager implements IConnectionManager {
    _nsp: any;
    _socketServer: any;
    _channel: string;
    _connectionsList: Map<connectionID, any>;
    eve: EventEmitter;
    on(eventType: string, func: any): void;
    emit(eventType: string, data?: any): void;
    abstract config(conf: any): any;
    setConnection(cid: connectionID, connection: any): void;
    destroyConnection(cid: connectionID): void;
    getConnection(cid: connectionID): any;
    reconnectionHandler(connectionSocket: any): void;
    connectionHandler(manager: any, connectionSocket: any): void;
    disconnectionHandler(manager: ConnectionManager, connectionSocket: any): void;
    subscribeToConnectionEvent(connID: connectionID, protocolAction: protoActionResponse): void;
    unsubscribeToConnectionEvent(connID: connectionID, protocolAction: protoActionResponse): void;
    publishConnectionEvent(connID: connectionID, protocolAction: protoActionRequest, data: any): void;
}
