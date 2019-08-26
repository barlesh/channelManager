import { agentID } from "../types/types";
import { IAgent } from "./agent";
interface IManager {
    add(data: any): string;
    get(id: any): any;
}
export declare class AgentsManager implements IManager {
    agentsList: Map<agentID, IAgent>;
    _resources: any;
    constructor(resourceManager: any);
    add(agentObj: any): agentID;
    get(id: agentID): IAgent;
    remove(id: agentID): void;
    getAgentsList(): Map<string, IAgent>;
    attachAgentToResource(agentID: any, resourceID: any): void;
}
export {};
