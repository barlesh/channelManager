import { AgentsManager } from "./agents-manager";
import { connectionID } from "@resource-control/connections";
export declare class AgentsManagerClient extends AgentsManager {
    agent: any;
    config(conf: any): void;
    createAgentClient(agentData: any, connectionID: connectionID): void;
}
