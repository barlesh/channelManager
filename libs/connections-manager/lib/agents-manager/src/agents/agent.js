"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Agent {
    constructor(agentObj, resourceManager) {
        if (!resourceManager) {
            throw new Error("no resource manager supplied");
        }
        const rManager = resourceManager;
        this.resources = rManager;
        this.data = agentObj;
    }
    addResource(resource, id) {
        return this.resources.add(resource, id);
    }
    getResource(resourceID) {
        return this.resources.get(resourceID);
    }
}
exports.Agent = Agent;
