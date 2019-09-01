"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const agent_1 = require("./agent");
const protocol_1 = require("@resource-control/protocol");
var AgentsManagerEvents;
(function (AgentsManagerEvents) {
    AgentsManagerEvents["agentRegistered"] = "agent-registered";
    AgentsManagerEvents["agentUnRegistered"] = "agent-un-registered";
})(AgentsManagerEvents = exports.AgentsManagerEvents || (exports.AgentsManagerEvents = {}));
class AgentsManager {
    constructor() {
        this.eve = new events_1.EventEmitter();
    }
    on(eventType, func) {
        this.eve.on(eventType, func);
    }
    emit(eventType, data) {
        this.eve.emit(eventType, data);
    }
    agentRegistration(connectionID, agentData) {
        console.log("agentRegistration: connctionID: ", connectionID, ", agentData: ", agentData);
        const agentID = this.createAgent(agentData, connectionID);
        this.registerAgentsEvents(connectionID, agentID);
        this.emit(AgentsManagerEvents.agentRegistered, agentID);
        return true;
    }
    registerAgentsEvents(connectionID, agentID) {
        const Action = protocol_1.protocolActions.createProtocolActionResponse("disconnect", this.agentDisconnection.bind(this, agentID), undefined, undefined);
        this.connectionManager.subscribeToConnectionEvent(connectionID, Action);
    }
    agentUnRegistration(connstionID) {
        console.warn("currently not supported");
        return false;
    }
    agentDisconnection(agentID, _disconnectionMsg) {
        return this.removeAgent(agentID);
    }
    createAgent(agentData, connectionID) {
        console.info(`creating agent. agentData: ${agentData}, agent id: ${agentData.id}. connectionID: ${connectionID}`);
        console.log("agentData: ", agentData, ", connectionID: ", connectionID);
        agentData["connectionID"] = connectionID;
        return this.add(agentData);
    }
    removeAgent(agentID) {
        console.info(`removing agent wth agent id: ${agentID} because of disconnection event.`);
        if (!agentID) {
            console.error("received agent disconnection event without agent id. cannot disconnect agent");
            throw new Error("failed to disconnect agent");
        }
        this.remove(agentID);
        this.emit(AgentsManagerEvents.agentUnRegistered, agentID);
        return true;
    }
    getAgentConnection(connectionID) {
        return this.connectionManager.getConnection(connectionID);
    }
    add(agentObj) {
        const agent = new agent_1.Agent(agentObj, this);
        const aid = agent._id;
        if (this.agentsList.get(aid)) {
            console.warn(`agent with id: ${aid} already exist. replacing old agent with the new agent (temppp)`);
        }
        this.agentsList.set(aid, agent);
        return aid;
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
    registerConnectionEvent(conID, protocolAction) {
        this.connectionManager.subscribeToConnectionEvent(conID, protocolAction);
    }
    publishEvent(conID, protocolAction, data) {
        this.connectionManager.publishConnectionEvent(conID, protocolAction, data);
    }
}
exports.AgentsManager = AgentsManager;
