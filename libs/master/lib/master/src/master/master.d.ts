import { IConnectionManager } from "./../../../connections-manager/src/connections";
import { IAgentsManager } from "./../../../agents-manager/src/agents/";
import { IResourceManager } from "./../../../resource-manager/src/resources";
import { protoActionRequest, protoActionResponse } from "./../../../protocol/src/actions";
import { resourceID } from "./../../../resource-manager/src/types/types";
export declare class Master {
    _connectionManager: IConnectionManager;
    _agentsManager: IAgentsManager;
    _resourceManager: IResourceManager;
    constructor(io: any, channel: string, protocolRequests: protoActionRequest[], protocolResponses: protoActionResponse[]);
    addResource(resource: any, resourceID: resourceID): void;
    publishEventToResource(rid: resourceID, event: string, data?: any): void;
}
