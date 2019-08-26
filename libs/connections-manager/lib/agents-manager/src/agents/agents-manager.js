"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uid = require("uuid");
const agent_1 = require("./agent");
class AgentsManager {
    constructor(resourceManager) {
        this.agentsList = new Map();
        this._resources = resourceManager;
    }
    add(agentObj) {
        const uidS = uid();
        const agent = new agent_1.Agent(agentObj, this._resources);
        this.agentsList.set(uidS, agent);
        return uidS;
    }
    get(id) {
        return this.agentsList.get(id);
    }
    remove(id) {
        this.agentsList.delete(id);
    }
    getAgentsList() {
        return this.agentsList;
    }
    attachAgentToResource(agentID, resourceID) {
        const agent = this.agentsList.get(agentID);
        agent.resources.attachAgentToResource(resourceID, agentID);
    }
}
exports.AgentsManager = AgentsManager;
