import { ResourceManager } from "./../../../resource-manager/src/resources";
export interface IAgent {
    resources: ResourceManager;
    addResource(resource: any, id: any): any;
    getResource(resourceID: any): any;
}
export declare class Agent implements IAgent {
    resources: ResourceManager;
    data: any;
    _id: any;
    constructor(agentObj: any, resourceManager: ResourceManager);
    addResource(resource: any, id: any): void;
    getResource(resourceID: any): any;
}
