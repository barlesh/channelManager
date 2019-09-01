"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connections_1 = require("../../../libs/connections-manager/src/connections");
const agents_1 = require("../../../libs/agents-manager/src/agents");
const resources_1 = require("../../../libs/resource-manager/src/resources");
const actions_1 = require("../../../libs/protocol/src/actions");
const resource_protocol_1 = require("../../../libs/resource-manager/src/protocol/resource.protocol");
class Slave {
    constructor(io, channel, masterAddr, masterPort, protocolRequests, protocolResponses, uniqueID, slaveName) {
        if (!io ||
            !channel ||
            !masterAddr ||
            !masterPort ||
            !protocolRequests ||
            !protocolResponses ||
            !uniqueID) {
            throw new Error("no connection manager supplied. cannot connect to outside world");
        }
        this.slaveID = uniqueID;
        this._connectionManager = new connections_1.ConnectionClient();
        this._agentsManager = new agents_1.AgentsManagerClient();
        this._resourceManager = new resources_1.ResourceManager(protocolResponses, protocolRequests, this._agentsManager);
        const connectionServerConfiguration = {
            io,
            channel,
            address: masterAddr,
            port: masterPort
        };
        const agent = {
            id: this.slaveID,
            name: slaveName
        };
        const agentManagerConfiguration = {
            connectionManager: this._connectionManager,
            agent: agent
        };
        this._connectionManager.config(connectionServerConfiguration);
        this._agentsManager.config(agentManagerConfiguration);
    }
    registerNewResource(resource) {
        const rid = resource["id"];
        if (!rid) {
            console.error("wrong resource format. no id supplied.");
            throw new Error("wrong resource format. no id supplied.");
        }
        const agentID = this.slaveID;
        const agent = this._agentsManager.get(agentID);
        this._resourceManager.add(resource, rid);
        const cid = agent._connectionID;
        let action = actions_1.protocolActions.createProtocolActionRequest(resource_protocol_1.resourceProtocolEvents.resourceAttach, false, undefined);
        console.log(`publishing event '${action.event}' with connection id: ${cid}, resource id: ${rid}`);
        this._connectionManager.publishConnectionEvent(cid, action, rid);
        this._resourceManager.attachResourceToAgent(agentID, rid);
    }
    publishEventToResource(rid, event, data) {
        this._resourceManager.publishEvent(rid, event, data);
    }
}
exports.Slave = Slave;
