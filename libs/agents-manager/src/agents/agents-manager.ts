import { agentID } from "../types/types";
import * as uid from "uuid";
import { Agent, IAgent } from "./agent";
import { agentsProtocolEvents } from "./../../../connections-manager/src/protocol";
import {
  IConnectionManager,
  connectionManagerEvents
} from "./../../../connections-manager/src/connections";
import { resourceProtocolEvents } from "../protocol/resource.protocol";
import { resourceID } from "../../../resource-manager/src/types/types";
import { IResourceManager } from "./../../../resource-manager/src/resources";
import { connectionID } from "../../../connections-manager/src/models";
import {
  protocolActions,
  protoAction
} from "../../../connections-manager/src/connections/protocol.actions";

export interface IAgentsManager {
  add(data): agentID;
  get(id): any;
  registerResource(agentID: agentID, resouceID: resourceID);
  getAgentConnection(agentID: agentID);
  registerConnectionEvent(
    conID: connectionID,
    event: string,
    handler: Function
  );
}

export class AgentsManager implements IAgentsManager {
  agentsList: Map<agentID, Agent>;
  resourcesManager: IResourceManager;
  connectionManager: IConnectionManager;

  constructor(
    connectionMnager: IConnectionManager,
    resourceManager: IResourceManager
  ) {
    this.agentsList = new Map();
    this.connectionManager = connectionMnager;
    this.resourcesManager = resourceManager;

    this.connectionManager.on(
      connectionManagerEvents.remoteConnected,
      this.registerToAgentRegistrationEvents.bind(this)
    );
  }

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
    let Action: protoAction;
    const f = this.agentRegistration
    const bindedagentRegistration = this.agentRegistration.bind(
      this,
      connectionID
    );
    Action = protocolActions.createProtocolAction(
      agentsProtocolEvents.agentRegister,
      bindedagentRegistration,
      undefined,
      undefined
    );
    this.connectionManager.listenToConnectionEvent(connectionID, Action);

    const bindedagentUnRegistration = this.agentUnRegistration.bind(
      this,
      connectionID
    );
    Action = protocolActions.createProtocolAction(
      agentsProtocolEvents.agentUnRegister,
      bindedagentUnRegistration,
      undefined,
      undefined
    );
    this.connectionManager.listenToConnectionEvent(connectionID, Action);
  }

  registerAgentToResourcesEvents(connectionID, agentID) {
    let Action: protoAction;
    const bindedregisterResource = this.registerResource.bind(
      this,
      agentID
    );
    const bindedunregisterSource = this.unregisterSource.bind(this, agentID);

    Action = protocolActions.createProtocolAction(
      resourceProtocolEvents.resourceAttach,
      bindedregisterResource,
      undefined,
      undefined
    );
    this.connectionManager.listenToConnectionEvent(connectionID, Action);

    Action = protocolActions.createProtocolAction(
      resourceProtocolEvents.resouceDetach,
      bindedunregisterSource,
      undefined,
      undefined
    );
    this.connectionManager.listenToConnectionEvent(connectionID, Action);
  }

  getAgentConnection(connectionID) {
    return this.connectionManager.getConnection(connectionID);
  }

  add(agentObj): agentID {
    // validate agent - TODO

    // generate unique ID
    const uidS: string = uid();
    agentObj["agentID"] = uidS;
    const agent = new Agent(agentObj, this);
    this.agentsList.set(uidS, agent);
    return uidS;
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
    if (!agentID) {
      console.warn(`no agent ID found : ${agentID}`);
      return;
    }
    const agent = this.agentsList.get(agentID);
    this.resourcesManager.attachResourceToAgent(agent, resouceID);
    return true;
  }

  unregisterSource(agentID: agentID, resouceID: resourceID) {
    if (!agentID) {
      console.warn(`no agent found: ${agentID}.`);
      return;
    }
    const agent = this.agentsList.get(agentID);
    this.resourcesManager.detachResourceFromAgent(agent, resouceID);
    return true;
  }

  registerConnectionEvent(conID: connectionID, protocolAction) {
    this.connectionManager.listenToConnectionEvent(conID, protocolAction);
  }
}
