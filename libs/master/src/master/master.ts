import {
  IConnectionManager,
  ConnectionServer
} from "@resource-control/connection";
import {
  IAgentsManager,
  AgentsManagerServer
} from "@resource-control/agent";
import {
  IResourceManager,
  ResourceManager
} from "@resource-control/resource";
        
import {
  protoActionRequest,
  protoActionResponse
} from "@resource-control/protocol";
import { resourceID } from "@resource-control/resource";

export class Master {
  _connectionManager: IConnectionManager;
  _agentsManager: IAgentsManager;
  _resourceManager: IResourceManager;

  constructor(
    io,
    channel: string,
    attachResourceHandler: Function,
    detachResourceHandler: Function,
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

    this._agentsManager = new AgentsManagerServer();
    // init the master's resource manager
    this._resourceManager = new ResourceManager(
      attachResourceHandler,
      detachResourceHandler,
      protocolResponses,
      protocolRequests,
      this._agentsManager
    );

    // init agents manager, with the connection & resource managers
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

  addResource(resource, resourceID: resourceID) {
    this._resourceManager.add(resource, resourceID);
  }

  publishEventToResource(rid: resourceID, event: string, data?) {
    this._resourceManager.publishEvent(rid, event, data);
  }
}
