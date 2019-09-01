"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connections_1 = require("./../../../connections-manager/src/connections");
const agents_1 = require("./../../../agents-manager/src/agents/");
const resources_1 = require("./../../../resource-manager/src/resources");
class Master {
    constructor(io, channel, protocolRequests, protocolResponses) {
        if (!io || !channel || !protocolRequests || !protocolResponses) {
            throw new Error("no connection manager supplied. cannot connect to outside world");
        }
        this._connectionManager = new connections_1.ConnectionServer();
        this._agentsManager = new agents_1.AgentsManagerServer();
        this._resourceManager = new resources_1.ResourceManager(protocolResponses, protocolRequests, this._agentsManager);
        const connectionServerConfiguration = {
            io,
            channel
        };
        const agentManagerConfiguration = {
            connectionManager: this._connectionManager
        };
        this._connectionManager.config(connectionServerConfiguration);
        this._agentsManager.config(agentManagerConfiguration);
    }
    addResource(resource, resourceID) {
        console.log("Addying new resource with resource id: ", resourceID);
        this._resourceManager.add(resource, resourceID);
    }
    publishEventToResource(rid, event, data) {
        this._resourceManager.publishEvent(rid, event, data);
    }
}
exports.Master = Master;
