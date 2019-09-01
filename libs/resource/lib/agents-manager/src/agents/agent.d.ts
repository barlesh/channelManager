import { AgentsManager } from "./agents-manager";
import { connectionID } from "../../../connections-manager/src/models";
import { agentID } from "../types/types";
import { protoActionResponse, protoActionRequest } from "./../../../protocol/src/actions";
export interface IAgent {
    _id: any;
    _connectionID: any;
    _manager: any;
    registerProtocolEvent(protocolAction: protoActionResponse): any;
    unregisterProtocolEvent(protocolAction: protoActionResponse): any;
    getID(): agentID;
}
export declare class Agent implements IAgent {
    _id: any;
    _connectionID: connectionID;
    _manager: AgentsManager;
    constructor(agentObj: any, agentManager: AgentsManager);
    registerProtocolEvent(protocolAction: protoActionResponse): void;
    unregisterProtocolEvent(protocolAction: protoActionResponse): void;
    publishEvent(protocolAction: protoActionRequest, data: any): void;
    getID(): any;
}
