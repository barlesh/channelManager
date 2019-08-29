import {
  IConnectionManager,
  ConnectionServer
} from "./../../../libs/connections-manager/src/connections";
import {
  IAgentsManager,
  AgentsManagerServer
} from "./../../../libs/agents-manager/src/agents/";
import {
  IResourceManager,
  ResourceManager
} from "./../../../libs/resource-manager/src/resources";
import {
  protoActionRequest,
  protoActionResponse
} from "../../../libs/connections-manager/src/connections/protocol.actions";
import { resourceID } from "../../../libs/resource-manager/src/types/types";

export class Master {
  _connectionManager: IConnectionManager;
  _agentsManager: IAgentsManager;
  _resourceManager: IResourceManager;

  constructor(
    io,
    channel: string,
    protocolRequests: protoActionRequest[],
    protocolResponses: protoActionResponse[]
  ) {
    // receice the connection manager
    if (!io || !channel || !protocolRequests || !protocolResponses) {
      throw new Error(
        "no connection manager supplied. cannot connect to outside world"
      );
    }

    this._connectionManager = new ConnectionServer();

    // init the master's resource manager
    this._resourceManager = new ResourceManager(
      protocolResponses,
      protocolRequests
    );

    this._agentsManager = new AgentsManagerServer();

    // init agents manager, with the connection & resource managers
    const connectionServerConfiguration = {
      io,
      channel
    };
    const agentManagerConfiguration = {
      connectionManager: this._connectionManager,
      resourceManager: this._resourceManager
    };

    this._connectionManager.config(connectionServerConfiguration);
    this._agentsManager.config(agentManagerConfiguration);
  }

  addResource(resource, resourceID: resourceID) {
    this._resourceManager.add(resource, resourceID);
  }

  publishEventToResource(rid: resourceID, event: string, data?) {
    this._resourceManager.publishEvent(rid, event, data);
  }
}
