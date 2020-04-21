import {
  IConnectionManager,
  ConnectionServer
} from "@resource-control/connection";
import { IAgentsManager, AgentsManagerServer } from "@resource-control/agent";
import { IResourceManager, ResourceServer } from "@resource-control/resource";

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
    // console.log("constructing Master.");
    if (!io || !channel || !protocolRequests || !protocolResponses) {
      throw new Error(
        "wrong costructing paramaters supplied. can not construct Master"
      );
    }

    this._connectionManager = new ConnectionServer();

    this._agentsManager = new AgentsManagerServer();
    // init the master's resource manager
    this._resourceManager = new ResourceServer(
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
    // console.debug("Master: addying resource with resource id: ", resourceID);
    this._resourceManager.add(resource, resourceID);
  }

  removeResource(resourceID) {
    // console.debug("Master: removing resource with resource id: ", resourceID);
    this._resourceManager.remove(resourceID);
}

  publishEventToResource(rid: resourceID, event: string, data?) {
    this._resourceManager.publishEvent(rid, event, data);
  }
}
