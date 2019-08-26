"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResourceManager {
    constructor() {
        this.resourcesList = new Map();
        this.resourceAgentMap = new Map();
    }
    add(resource, id) {
        if (!id) {
            throw new Error("no unique id supply");
        }
        this.resourcesList.set(id, resource);
    }
    get(id) {
        return this.resourcesList.get(id);
    }
    size() {
        return this.resourcesList.size;
    }
    remove(id) {
        this.resourcesList.delete(id);
    }
    getResourcesList() {
        return this.resourcesList;
    }
    attachAgentToResource(resourceID, agentID) {
        if (!this.resourcesList.get(resourceID)) {
            throw new Error("resource not exist.");
        }
        this.resourceAgentMap.set(resourceID, agentID);
    }
    detachAgentFromResourceByAgent(agentID) {
        console.log(`detaching agent with agentID: ${agentID}`);
        console.log("map: ", this.resourceAgentMap);
        const resources_ids = [];
        this.resourceAgentMap.forEach((a_id, r_id) => {
            console.log(`iterating the agents-resources map object: r_id: ${r_id}, a_id: ${a_id}`);
            if (a_id === agentID) {
                resources_ids.push(r_id);
            }
        });
        console.log("resources to delete: ", resources_ids);
        resources_ids.forEach(r_id => {
            this.resourceAgentMap.delete(r_id);
        });
    }
}
exports.ResourceManager = ResourceManager;
