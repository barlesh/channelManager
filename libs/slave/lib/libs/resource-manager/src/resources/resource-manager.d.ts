import { resourceID } from "../types/types";
import { Agent, AgentsManager } from "../../../agents-manager/src/agents";
import { protoActionResponse, protoActionRequest } from "../../../protocol/src/actions";
import { agentID } from "../../../agents-manager/src/types/types";
export interface IResourceManager {
    _protocolResponse: protoActionResponse[];
    _protocolRequest: Map<string, protoActionRequest>;
    _resourceAgentMap: Map<resourceID, Agent>;
    _agentsManager: AgentsManager;
    add(data: any, id?: any): resourceID;
    get(id: any): any;
    size(): number;
    attachResourceToAgent(agentID: agentID, resourceID: resourceID): any;
    detachResourceFromAgent(agent: Agent, resourceID: resourceID): any;
    publishEvent(resourceID: resourceID, event: string, data: any): any;
    detachAgent(agentID: agentID): any;
}
export declare class ResourceManager<T = any> implements IResourceManager {
    resourcesList: Map<resourceID, T>;
    _resourceAgentMap: Map<resourceID, Agent>;
    _protocolResponse: protoActionResponse[];
    _protocolRequest: Map<string, protoActionRequest>;
    _agentsManager: AgentsManager;
    constructor(responses: protoActionResponse[], requests: protoActionRequest[], agentsManager: any);
    HandleAgentRegistration(agentID: any): void;
    HandleAgentUnRegistration(agentID: agentID): void;
    registerResourceListeners(agentID: agentID): void;
    detachAgent(agentID: any): void;
    unregisterResourceListeners(agentID: agentID): void;
    loadRequestsToMap(actionRequests: protoActionRequest[]): void;
    add(resource: any, id?: any): resourceID;
    get(id: resourceID): T;
    size(): number;
    remove(id: resourceID): void;
    getResourcesList(): Map<string, T>;
    attachResourceToAgent(agentID: agentID, resourceID: resourceID): boolean;
    detachResourceFromAgent(agent: Agent, resourceID: resourceID): void;
    registerProtocolEvents(agent: Agent): void;
    unregisterProtocolEvents(agent: Agent): void;
    getResourcesByAgent(agentID: agentID): any[];
    publishEvent(resourceID: resourceID, event: string, data: any): void;
    myResourceHandler(): void;
}
