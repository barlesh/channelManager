/// <reference types="node" />
import { agentID } from "../types/types";
import { EventEmitter } from "events";
import { Agent } from "./agent";
import { connectionID } from "../../../connections-manager/src/models";
import { protoActionResponse, protoActionRequest } from "../../../protocol/src/actions";
export declare enum AgentsManagerEvents {
    agentRegistered = "agent-registered",
    agentUnRegistered = "agent-un-registered"
}
export interface IAgentsManager {
    add(data: any): agentID;
    get(id: any): any;
    getAgentConnection(agentID: agentID): any;
    registerConnectionEvent(conID: connectionID, action: protoActionResponse): any;
    publishEvent(conID: connectionID, protocolAction: any, data: any): any;
    config(configuration: any): any;
}
export declare abstract class AgentsManager implements IAgentsManager {
    agentsList: Map<agentID, Agent>;
    connectionManager: any;
    eve: EventEmitter;
    on(eventType: string, func: any): void;
    emit(eventType: string, data?: any): void;
    abstract config(conf: any): any;
    agentRegistration(connectionID: any, agentData: any): boolean;
    registerAgentsEvents(connectionID: any, agentID: any): void;
    agentUnRegistration(connstionID: connectionID): boolean;
    agentDisconnection(agentID: agentID, _disconnectionMsg: any): boolean;
    createAgent(agentData: any, connectionID: connectionID): string;
    removeAgent(agentID: any): boolean;
    getAgentConnection(connectionID: any): any;
    add(agentObj: any): agentID;
    get(id: agentID): Agent;
    remove(id: agentID): void;
    getAgentsList(): Map<string, Agent>;
    registerConnectionEvent(conID: connectionID, protocolAction: protoActionResponse): void;
    publishEvent(conID: connectionID, protocolAction: protoActionRequest, data: any): void;
}
