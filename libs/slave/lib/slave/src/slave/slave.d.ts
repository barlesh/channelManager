import { ConnectionClient } from "../../../libs/connections-manager/src/connections";
import { AgentsManagerClient } from "../../../libs/agents-manager/src/agents";
import { IResourceManager } from "../../../libs/resource-manager/src/resources";
import { protoActionRequest, protoActionResponse } from "../../../libs/protocol/src/actions";
import { resourceID } from "../../../libs/resource-manager/src/types/types";
export declare class Slave {
    _connectionManager: ConnectionClient;
    _agentsManager: AgentsManagerClient;
    _resourceManager: IResourceManager;
    slaveID: string;
    constructor(io: any, channel: string, masterAddr: any, masterPort: any, protocolRequests: protoActionRequest[], protocolResponses: protoActionResponse[], uniqueID: string, slaveName?: string);
    registerNewResource(resource: any): void;
    publishEventToResource(rid: resourceID, event: string, data?: any): void;
}
