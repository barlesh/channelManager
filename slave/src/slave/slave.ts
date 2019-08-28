import {
  IConnectionManager,
  ConnectionClient
} from "../../../libs/connections-manager/src/connections";
import {
  IAgentsManager,
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
import { resourceID } from "../../../libs/resource-manager/src/types/types";
import { resourceProtocolEvents } from "../../../libs/agents-manager/src/protocol/resource.protocol";

export class Slave {
  _connectionManager: ConnectionClient;
  _agentsManager: AgentsManagerClient;
  _resourceManager: IResourceManager;
  uid: string;

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
    if (
      !io ||
      !channel ||
      !masterAddr ||
      !masterPort ||
      !protocolRequests ||
      !protocolResponses ||
      !uniqueID
    ) {
      throw new Error(
        "no connection manager supplied. cannot connect to outside world"
      );
    }

    this.uid = uniqueID;

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
      id: this.uid,
      name: slaveName
    };

    const agentManagerConfiguration = {
      connectionManager: this._connectionManager,
      resourceManager: this._resourceManager,
      agent: agentID
    };

    this._connectionManager.config(connectionServerConfiguration);
    this._agentsManager.config(agentManagerConfiguration);
  }

  registerNewResource(rid: resourceID) {
    const cid = this._agentsManager.get(this.uid)._connectionID;
    // TODO  - add this action to the protocol actions list and use it instead of building it
    const action = {
      event: resourceProtocolEvents.resourceAttach
    };
    // send resource registration event toward the master
    this._connectionManager.publishConnectionEvent(cid, action, rid);
  }

  publishEventToResource(rid: resourceID, event: string, data?) {
    this._resourceManager.publishEvent(rid, event, data);
  }
}
