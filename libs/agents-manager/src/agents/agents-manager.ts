import { agentID } from "../types/types";
import { Agent } from "./agent";
import { agentsProtocolEvents } from "./../../../connections-manager/src/protocol";
import { resourceProtocolEvents } from "../protocol/resource.protocol";
import { resourceID } from "../../../resource-manager/src/types/types";
import { IResourceManager } from "./../../../resource-manager/src/resources";
import { connectionID } from "../../../connections-manager/src/models";
import {
  protocolActions,
  protoActionResponse,
  protoActionRequest
} from "../../../protocol/src/protocol.actions";

export interface IAgentsManager {
  add(data): agentID;
  get(id): any;
  registerResource(agentID: agentID, resouceID: resourceID);
  getAgentConnection(agentID: agentID);
  registerConnectionEvent(conID: connectionID, action: protoActionResponse);
  publishEvent(conID: connectionID, protocolAction, data);
  config(configuration: any);
}

export abstract class AgentsManager implements IAgentsManager {
  agentsList: Map<agentID, Agent>;
  resourcesManager: IResourceManager;
  connectionManager; //: IConnectionManager;

  abstract config(conf);

  agentRegistration(connectionID, agentData) {
    // validate agent data
    // TODO
    //attach connection id to the validated agent data
    agentData["connectionID"] = connectionID;
    // create new agent
    const agentID = this.add(agentData);
    // register the agents events to the connection object
    this.registerAgentToResourcesEvents(connectionID, agentID);
    return true;
  }

  agentUnRegistration(data) {
    try {
      const { connectionID } = data;
    } catch (err) {
      console.log("could not extract agent data and/or connection ID");
      return false;
    }
    return true;

    // remove the agent with the attached connection ID
  }

  registerToAgentRegistrationEvents(connectionID) {
    if (!connectionID) {
      console.warn(
        "cannot regiaster to agent registration event without remote connection. abort"
      );
      return;
    }

    /* 
      register events to the remote connection.
      The interesting events are agent registration (agentsProtocolEvents.agentRegister) and agent un registration.
      Bind the connectionID to the event handler, so the registered agent will have access to the connection object
      !!!!!!!!! CHECK IF CONNECTION OBJECT DOES NOT OVERIDE THE this OBJECT, AND THE AGENT-MANAGER WILL NOT BE ACCASSIABLE
      IN THIS CASE, THE AGENT-MANAGER WILL BE NEEDED TO BE BIND !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */
    let Action: protoActionResponse;
    const f = this.agentRegistration;
    const bindedagentRegistration = this.agentRegistration.bind(
      this,
      connectionID
    );
    Action = protocolActions.createProtocolActionResponse(
      agentsProtocolEvents.agentRegister,
      bindedagentRegistration,
      undefined,
      undefined
    );
    this.connectionManager.subscribeToConnectionEvent(connectionID, Action);

    const bindedagentUnRegistration = this.agentUnRegistration.bind(
      this,
      connectionID
    );
    Action = protocolActions.createProtocolActionResponse(
      agentsProtocolEvents.agentUnRegister,
      bindedagentUnRegistration,
      undefined,
      undefined
    );
    this.connectionManager.subscribeToConnectionEvent(connectionID, Action);
  }

  registerAgentToResourcesEvents(connectionID, agentID) {
    let Action: protoActionResponse;
    const bindedregisterResource = this.registerResource.bind(this, agentID);
    const bindedunregisterResource = this.unregisterResource.bind(
      this,
      agentID
    );

    Action = protocolActions.createProtocolActionResponse(
      resourceProtocolEvents.resourceAttach,
      bindedregisterResource,
      undefined,
      undefined
    );
    this.connectionManager.subscribeToConnectionEvent(connectionID, Action);

    Action = protocolActions.createProtocolActionResponse(
      resourceProtocolEvents.resouceDetach,
      bindedunregisterResource,
      undefined,
      undefined
    );
    this.connectionManager.subscribeToConnectionEvent(connectionID, Action);

    // temp
    Action = protocolActions.createProtocolActionResponse(
      "disconnect",
      this.removeAgent.bind(this, agentID),
      undefined,
      undefined
    );
    this.connectionManager.subscribeToConnectionEvent(connectionID, Action);
  }

  removeAgent(agentID, disconnectioMsg) {
    console.info(`removing agent wth agent id: ${agentID} because of disconnection event.`)
    if(!agentID){
      console.error("received agent disconnection event without agent id. cannot disconnect agent");
      throw new Error("failed to disconnect agent");
    }
    const agent = this.get(agentID);

    this.resourcesManager.detachAgent(agent);
    this.remove(agentID);
    return true;
  }

  getAgentConnection(connectionID) {
    return this.connectionManager.getConnection(connectionID);
  }

  add(agentObj): agentID {
    // validate agent - TODO

    // generate unique ID
    const agent = new Agent(agentObj, this);
    const aid = agent._id;
    if (this.agentsList.get(aid)) {
      console.warn(
        `agent with id: ${aid} already exist. replacing old agent with the new agent (temppp)`
      );
    }

    this.agentsList.set(aid, agent);
    return aid;
  }

  get(id: agentID) {
    return this.agentsList.get(id);
  }

  remove(id: agentID) {
    this.agentsList.delete(id);
  }

  getAgentsList() {
    return this.agentsList;
  }

  registerResource(agentID: agentID, resouceID: resourceID) {
    console.info(
      `registering resource with id ${resouceID} to agent with id ${agentID}`
    );
    if (!agentID) {
      console.warn(`no agent ID found : ${agentID}`);
      return;
    }
    const agent = this.agentsList.get(agentID);
    this.resourcesManager.attachResourceToAgent(agent, resouceID);
    return true;
  }

  unregisterResource(agentID: agentID, resouceID: resourceID) {
    console.info(
      `un-registering resource with id ${resouceID} from agent with id ${agentID}`
    );
    if (!agentID) {
      console.warn(`no agent found: ${agentID}.`);
      return;
    }
    const agent = this.agentsList.get(agentID);
    this.resourcesManager.detachResourceFromAgent(agent, resouceID);
    return true;
  }

  registerConnectionEvent(
    conID: connectionID,
    protocolAction: protoActionResponse
  ) {
    this.connectionManager.subscribeToConnectionEvent(conID, protocolAction);
  }

  publishEvent(conID: connectionID, protocolAction: protoActionRequest, data) {
    this.connectionManager.publishConnectionEvent(conID, protocolAction, data);
  }
}
