import { ConnectionClient } from "./../../../connections-manager/src/connections";
import { AgentsManagerClient } from "./../../../agents-manager/src/agents";
import { IResourceManager } from "./../../../resource-manager/src/resources";
import { protoActionRequest, protoActionResponse } from "./../../../protocol/src/actions";
import { resourceID } from "./../../../resource-manager/src/types/types";
export declare class Slave {
    _connectionManager: ConnectionClient;
    _agentsManager: AgentsManagerClient;
    _resourceManager: IResourceManager;
    slaveID: string;
    constructor(io: any, channel: string, masterAddr: any, masterPort: any, protocolRequests: protoActionRequest[], protocolResponses: protoActionResponse[], uniqueID: string, slaveName?: string);
    registerNewResource(resource: any): void;
    publishEventToResource(rid: resourceID, event: string, data?: any): void;
}
