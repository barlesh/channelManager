"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../../../protocol/src/actions");
const uid = require("uuid");
const agents_1 = require("./../../../agents-manager/src/agents");
const resource_protocol_1 = require("./../protocol/resource.protocol");
class ResourceManager {
    constructor(responses, requests, agentsManager) {
        console.log("validating protocol");
        if (actions_1.protocolActions.validateProtocolActionResponse(responses)) {
            this._protocolResponse = responses;
        }
        else {
            throw new Error("response protocol of bad type");
        }
        console.log("validating REQUEST protocol. REQUEST: ", requests);
        this._protocolRequest = new Map();
        if (actions_1.protocolActions.validateProtocolActionRequest(requests)) {
            this.loadRequestsToMap(requests);
        }
        else {
            throw new Error("request protocol of bad type");
        }
        console.log("DONE validating protocol");
        if (!agentsManager) {
            throw new Error("a valid agent manager was not supplied");
        }
        this._agentsManager = agentsManager;
        this.resourcesList = new Map();
        this._resourceAgentMap = new Map();
        this._agentsManager.on(agents_1.AgentsManagerEvents.agentRegistered, this.HandleAgentRegistration.bind(this));
        this._agentsManager.on(agents_1.AgentsManagerEvents.agentUnRegistered, this.HandleAgentUnRegistration.bind(this));
    }
    HandleAgentRegistration(agentID) {
        this.registerResourceListeners(agentID);
    }
    HandleAgentUnRegistration(agentID) {
        this.detachAgent(agentID);
        this.unregisterResourceListeners(agentID);
    }
    registerResourceListeners(agentID) {
        const agent = this._agentsManager.get(agentID);
        const resourceAttachAction = actions_1.protocolActions.createProtocolActionResponse(resource_protocol_1.resourceProtocolEvents.resourceAttach, this.attachResourceToAgent.bind(this, agentID), undefined, undefined);
        const resourceDetachAction = actions_1.protocolActions.createProtocolActionResponse(resource_protocol_1.resourceProtocolEvents.resouceDetach, this.detachResourceFromAgent.bind(this, agentID), undefined, undefined);
        agent.registerProtocolEvent(resourceAttachAction);
        agent.registerProtocolEvent(resourceDetachAction);
    }
    detachAgent(agentID) {
        console.info(`detaching agent with agentID: ${agentID} from all resources`);
        const resourcesToDetach = this.getResourcesByAgent(agentID);
        resourcesToDetach.forEach(rid => {
            this._resourceAgentMap.delete(rid);
        });
        console.info(`Detached ${resourcesToDetach.length} resources.`);
    }
    unregisterResourceListeners(agentID) {
        console.warn("unregisterResourceListeners: currently not supported");
    }
    loadRequestsToMap(actionRequests) {
        actionRequests.forEach(action => {
            this._protocolRequest.set(action.event, action);
        });
    }
    add(resource, id) {
        if (!id) {
            id = uid();
        }
        if (this.resourcesList.get(id)) {
            console.warn("resource with the same id exist. abort");
            throw new Error("resource id already exist");
        }
        this.resourcesList.set(id, resource);
        return id;
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
    attachResourceToAgent(agentID, resourceID) {
        if (!this.resourcesList.get(resourceID)) {
            throw new Error("resource not exist.");
        }
        if (!agentID) {
            console.error("no agent id supplied");
            throw new Error("no agent id supplied");
        }
        const agent = this._agentsManager.get(agentID);
        if (!agent) {
            console.error("no agent found with agent id: ", agentID);
            throw new Error(`no agent found with agent id:  ${agentID}`);
        }
        console.info(`attaching agent with agentID: ${agentID} to resource with resourceID: ${resourceID}`);
        this._resourceAgentMap.set(resourceID, agent);
        this.registerProtocolEvents(agent);
        return true;
    }
    detachResourceFromAgent(agent, resourceID) {
        const agentID = agent.getID();
        console.info(`detaching agent with agentID: ${agentID} to resource with resourceID: ${resourceID}`);
        this._resourceAgentMap.delete(resourceID);
        this.unregisterProtocolEvents(agent);
    }
    registerProtocolEvents(agent) {
        try {
            this._protocolResponse.forEach(protocolAction => {
                agent.registerProtocolEvent(protocolAction);
            });
        }
        catch (err) {
            console.warn("could not load protocol. error: ", err);
            return;
        }
    }
    unregisterProtocolEvents(agent) {
        try {
            this._protocolResponse.forEach(protocolElement => {
                agent.unregisterProtocolEvent(protocolElement);
            });
        }
        catch (err) {
            console.warn("could not load protocol. error: ", err);
            return;
        }
    }
    getResourcesByAgent(agentID) {
        const resourcesToDetach = [];
        this._resourceAgentMap.forEach((value, key, map) => {
            if (value._id === agentID) {
                resourcesToDetach.push(key);
            }
        });
        return resourcesToDetach;
    }
    publishEvent(resourceID, event, data) {
        const agent = this._resourceAgentMap.get(resourceID);
        if (!agent) {
            console.warn(`could not find agent that hold resource with resource id: ${resourceID}`);
            throw new Error("can not publish event. agent not found");
        }
        const action = this._protocolRequest.get(event);
        agent.publishEvent(action, data);
    }
    myResourceHandler() { }
}
exports.ResourceManager = ResourceManager;
