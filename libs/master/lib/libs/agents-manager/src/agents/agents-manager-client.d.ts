import { AgentsManager } from "./agents-manager";
import { connectionID } from "../../../connections-manager/src/models";
export declare class AgentsManagerClient extends AgentsManager {
    agent: any;
    config(conf: any): void;
    createAgentClient(agentData: any, connectionID: connectionID): void;
}
