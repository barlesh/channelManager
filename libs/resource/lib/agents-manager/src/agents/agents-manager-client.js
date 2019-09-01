"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agents_manager_1 = require("./agents-manager");
const connections_1 = require("./../../../connections-manager/src/connections");
const protocol_1 = require("../../../connections-manager/src/protocol");
class AgentsManagerClient extends agents_manager_1.AgentsManager {
    config(conf) {
        const connectionManager = conf["connectionManager"];
        this.agent = conf["agent"];
        if (!connectionManager || !this.agent) {
            console.error("not all parameres supplied.");
            throw new Error("not all parameres supplied");
        }
        this.agentsList = new Map();
        this.connectionManager = connectionManager;
        console.log("agent manager client: binding agent object to createAgentClient: ", this.agent);
        this.connectionManager.on(connections_1.connectionClientManagerEvents.connectedToRemote, this.createAgentClient.bind(this, this.agent));
        this.connectionManager.on(connections_1.connectionClientManagerEvents.disconnectedFromRemote, this.agentDisconnection.bind(this, this.agent["id"]));
        this.connectionManager.on(connections_1.connectionClientManagerEvents.remoteDisconnected, this.agentDisconnection.bind(this, this.agent["id"]));
        this.connectionManager.connectToServer();
    }
    createAgentClient(agentData, connectionID) {
        console.log("createAgentClient: connectionID: ", connectionID, ", agentData: ", agentData);
        const agentID = this.createAgent(agentData, connectionID);
        const Action = {
            event: protocol_1.agentsProtocolEvents.agentRegister,
            expectResponse: false,
            response: undefined
        };
        this.publishEvent(connectionID, Action, this.agent);
        this.emit(agents_manager_1.AgentsManagerEvents.agentRegistered, agentID);
    }
}
exports.AgentsManagerClient = AgentsManagerClient;
