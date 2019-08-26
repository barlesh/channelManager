import { IConnectionManager } from "./../../../libs/connections-manager/src/connections";
import {
  IAgentsManager,
  AgentsManager
} from "./../../../libs/agents-manager/src/agents/";
import {
  IResourceManager,
  ResourceManager
} from "./../../../libs/resource-manager/src/resources";
import { protoAction } from "../../../libs/connections-manager/src/connections/protocol.actions";
export interface IMaster {
  _connectionManager: IConnectionManager;
  _agentsManager: IAgentsManager;
  _resourceManager: IResourceManager;
}

export class Master implements IMaster {
  _connectionManager: IConnectionManager;
  _agentsManager: IAgentsManager;
  _resourceManager: IResourceManager;

  constructor(connManager: IConnectionManager, protocol: protoAction[]) {
    // receice the connection manager
    if (!connManager) {
      throw new Error(
        "no connection manager supplied. cannot connect to outside world"
      );
    }
    this._connectionManager = connManager;

    // init the master's resource manager
    this._resourceManager = new ResourceManager(protocol);

    // init agents manager, with the connection & resource managers
    this._agentsManager = new AgentsManager(
      this._connectionManager,
      this._resourceManager
    );
  }
}
