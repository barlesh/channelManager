import { resourceID } from "../types/types";
import { agentID } from "../../../agents-manager/src/types/types";
interface IManager {
    add(data: any, id: any): any;
    get(id: any): any;
    size(): number;
    attachAgentToResource(resourceID: resourceID, agentID: agentID): any;
}
export declare class ResourceManager implements IManager {
    resourcesList: Map<resourceID, any>;
    resourceAgentMap: Map<resourceID, agentID>;
    constructor();
    add(resource: any, id: any): void;
    get(id: resourceID): any;
    size(): number;
    remove(id: resourceID): void;
    getResourcesList(): Map<string, any>;
    attachAgentToResource(resourceID: resourceID, agentID: agentID): void;
    detachAgentFromResourceByAgent(agentID: agentID): void;
}
export {};
