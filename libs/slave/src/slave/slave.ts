import {
  IConnectionManager,
  ConnectionClient
} from "@resource-control/connection";
import { IAgentsManager, AgentsManagerClient } from "@resource-control/agent";
import { IResourceManager, ResourceManager } from "@resource-control/resource";
import {
  protoActionRequest,
  protoActionResponse,
  protocolActions
} from "@resource-control/protocol";
import { resourceID } from "@resource-control/resource";
import { resourceProtocolEvents } from "@resource-control/resource";

export class Slave {
  _connectionManager: ConnectionClient;
  _agentsManager: AgentsManagerClient;
  _resourceManager: IResourceManager;
  slaveID: string;

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

    this.slaveID = uniqueID;

    this._connectionManager = new ConnectionClient();

    this._agentsManager = new AgentsManagerClient();
    // init the master's resource manager
    this._resourceManager = new ResourceManager(
      protocolResponses,
      protocolRequests,
      this._agentsManager
    );

    // init agents manager, with the connection & resource managers
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

  async registerNewResource(resource: any): Promise<any> {
    const rid = resource["id"];
    if (!rid) {
      console.error("wrong resource format. no id supplied.");
      throw new Error("wrong resource format. no id supplied.");
    }
    const agentID = this.slaveID;
    const agent = this._agentsManager.get(agentID);
    if (!agent) {
      console.error("could not get slave's agent detailes.");
      throw new Error("agent not connected");
    }
    /* this is the slave, so the resource is registered localy without confirmation from the master - TODO - change this behaviour??? */
    this._resourceManager.add(resource, rid);
    const cid = agent._connectionID;
    // TODO  - add this action to the protocol actions list and use it instead of building it
    // let action = {
    //   event: resourceProtocolEvents.resourceAttach,

    // };
    const response = protocolActions.createProtocolActionResponse(
      "attached-resource-success",
      undefined,
      undefined,
      undefined
    );
    let action = protocolActions.createProtocolActionRequest(
      resourceProtocolEvents.resourceAttach,
      true,
      response
    );
    console.log(
      `publishing event '${action.event}' with connection id: ${cid}, resource id: ${rid}`
    );
    // send resource registration event toward the master
    const returnValue = await this._connectionManager.publishConnectionEvent(
      cid,
      action,
      rid
    );
    // attach agent to resource - TODO - should I do it in response to a successfulll server agent-resource attachment?
    this._resourceManager.attachResourceToAgent(agentID, rid);

    return returnValue;
  }

  unregisterResource(resourceID: resourceID) {
    console.info("unregistering resource with resource id: ", resourceID);
    // this._resourceManager.publishResourceDetach(resourceID);
    // this._resourceManager.detachResourceFromAgent();
  }

  publishEventToResource(rid: resourceID, event: string, data?) {
    this._resourceManager.publishEvent(rid, event, data);
  }
}
