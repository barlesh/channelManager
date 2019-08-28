import {
  IConnectionManager,
  ConnectionServer,
  ConnectionClient
} from "../../../libs/connections-manager/src/connections";
import {
  IAgentsManager,
  AgentsManager,
  AgentsManagerServer,
  AgentsManagerClient
} from "../../../libs/agents-manager/src/agents";
import {
  IResourceManager,
  ResourceManager
} from "../../../libs/resource-manager/src/resources";
import {
  protoActionRequest,
  protoActionResponse
} from "../../../libs/connections-manager/src/connections/protocol.actions";

export class Slave {
  _connectionManager: IConnectionManager;
  _agentsManager: IAgentsManager;
  _resourceManager: IResourceManager;

  constructor(
    io,
    channel: string,
    masterAddr,
    masterPort,
    protocolRequests: protoActionRequest[],
    protocolResponses: protoActionResponse[],
    uniqueID: string,
    slaveName?: string
  ) {
    // receice the connection manager
    if (!io || !channel || !masterAddr || !masterPort || !protocolRequests || !protocolResponses || !uniqueID) {
      throw new Error(
        "no connection manager supplied. cannot connect to outside world"
      );
    }

    this._connectionManager = new ConnectionClient();

    // init the master's resource manager
    this._resourceManager = new ResourceManager(
      protocolResponses,
      protocolRequests
    );

    this._agentsManager = new AgentsManagerClient();

    // init agents manager, with the connection & resource managers
    const connectionServerConfiguration = {
      io,
      channel,
      address: masterAddr,
      port: masterPort
    };

    const agentID = {
      id: uniqueID,
      name: slaveName
    }

    const agentManagerConfiguration = {
      connectionManager: this._connectionManager,
      resourceManager: this._resourceManager,
      agent: agentID
    };

    this._connectionManager.config(connectionServerConfiguration);
    this._agentsManager.config(agentManagerConfiguration);
  }
}
