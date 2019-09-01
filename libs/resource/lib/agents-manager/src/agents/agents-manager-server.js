"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connections_1 = require("../../../connections-manager/src/connections");
const agents_manager_1 = require("./agents-manager");
const protocol_1 = require("../../../connections-manager/src/protocol");
const actions_1 = require("../../../protocol/src/actions");
class AgentsManagerServer extends agents_manager_1.AgentsManager {
    config(conf) {
        const connectionManager = conf["connectionManager"];
        if (!connectionManager) {
            console.error("not all parameres supplied.");
            throw new Error("not all parameres supplied");
        }
        this.agentsList = new Map();
        this.connectionManager = connectionManager;
        this.connectionManager.on(connections_1.connectionServerManagerEvents.remoteConnected, this.registerToAgentRegistrationEvents.bind(this));
    }
    registerToAgentRegistrationEvents(connectionID) {
        if (!connectionID) {
            console.warn("cannot regiaster to agent registration event without remote connection. abort");
            return;
        }
        let Action;
        const f = this.agentRegistration;
        const bindedagentRegistration = this.agentRegistration.bind(this, connectionID);
        Action = actions_1.protocolActions.createProtocolActionResponse(protocol_1.agentsProtocolEvents.agentRegister, bindedagentRegistration, undefined, undefined);
        this.connectionManager.subscribeToConnectionEvent(connectionID, Action);
        const bindedagentUnRegistration = this.agentUnRegistration.bind(this, connectionID);
        Action = actions_1.protocolActions.createProtocolActionResponse(protocol_1.agentsProtocolEvents.agentUnRegister, bindedagentUnRegistration, undefined, undefined);
        this.connectionManager.subscribeToConnectionEvent(connectionID, Action);
    }
}
exports.AgentsManagerServer = AgentsManagerServer;
