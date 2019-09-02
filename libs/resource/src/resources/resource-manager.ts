import { Agent, AgentsManager } from "@resource-control/agent";
import { agentID } from "@resource-control/agent";
import { AgentsManagerEvents } from "@resource-control/agent";
import {
  protocolActions,
  protoActionResponse,
  protoActionRequest
} from "@resource-control/protocol";
import { resourceID } from "../types/types";
import { resourceProtocolEvents } from "./../protocol/resource.protocol";
import * as uid from "uuid";

export interface IResourceManager {
  _protocolResponse: protoActionResponse[];
  _protocolRequest: Map<string, protoActionRequest>;
  _resourceAgentMap: Map<resourceID, Agent>;
  _agentsManager: AgentsManager;
  add(data, id?): resourceID;
  get(id): any;
  size(): number;
  attachResourceToAgent(agentID: agentID, resourceID: resourceID);
  detachResourceFromAgent(agent: Agent, resourceID: resourceID);
  publishEvent(resourceID: resourceID, event: string, data);
  detachAgent(agentID: agentID);
}

export class ResourceManager<T = any> implements IResourceManager {
  resourcesList: Map<resourceID, T>;
  _resourceAgentMap: Map<resourceID, Agent>;
  _protocolResponse: protoActionResponse[];
  _protocolRequest: Map<string, protoActionRequest>;
  _agentsManager: AgentsManager;

  constructor(
    responses: protoActionResponse[],
    requests: protoActionRequest[],
    agentsManager
  ) {
    if (protocolActions.validateProtocolActionResponse(responses)) {
      this._protocolResponse = responses;
    } else {
      throw new Error("response protocol of bad type");
    }

    this._protocolRequest = new Map();
    if (protocolActions.validateProtocolActionRequest(requests)) {
      this.loadRequestsToMap(requests);
    } else {
      throw new Error("request protocol of bad type");
    }


    if (!agentsManager) {
      throw new Error("a valid agent manager was not supplied");
    }
    this._agentsManager = agentsManager;
    this.resourcesList = new Map();
    this._resourceAgentMap = new Map();

    // listen to an agent registration event
    this._agentsManager.on(
      AgentsManagerEvents.agentRegistered,
      this.HandleAgentRegistration.bind(this)
    );

    this._agentsManager.on(
      AgentsManagerEvents.agentUnRegistered,
      this.HandleAgentUnRegistration.bind(this)
    );
  }

  HandleAgentRegistration(agentID) {
    this.registerResourceListeners(agentID);
  }

  HandleAgentUnRegistration(agentID: agentID) {
    this.detachAgent(agentID);
    this.unregisterResourceListeners(agentID);
  }

  registerResourceListeners(agentID: agentID) {
    const agent = this._agentsManager.get(agentID);
    const resourceAttachAction = protocolActions.createProtocolActionResponse(
      resourceProtocolEvents.resourceAttach,
      this.attachResourceToAgent.bind(this, agentID),
      undefined,
      undefined
    );

    const resourceDetachAction = protocolActions.createProtocolActionResponse(
      resourceProtocolEvents.resouceDetach,
      this.detachResourceFromAgent.bind(this, agentID),
      undefined,
      undefined
    );
    agent.registerProtocolEvent(resourceAttachAction);
    agent.registerProtocolEvent(resourceDetachAction);
  }

  detachAgent(agentID) {
    console.info(`detaching agent with agentID: ${agentID} from all resources`);
    const resourcesToDetach = this.getResourcesByAgent(agentID);
    resourcesToDetach.forEach(rid => {
      this._resourceAgentMap.delete(rid);
    });
    console.info(`Detached ${resourcesToDetach.length} resources.`);
  }

  unregisterResourceListeners(agentID: agentID) {
    console.warn("unregisterResourceListeners: currently not supported");
  }

  loadRequestsToMap(actionRequests: protoActionRequest[]) {
    actionRequests.forEach(action => {
      this._protocolRequest.set(action.event, action);
    });
  }

  add(resource, id?): resourceID {
    // validate resource - TODO
    if (!id) {
      id = uid();
    }
    if (this.resourcesList.get(id)) {
      console.warn("resource with the same id exist. abort");
      throw new Error("resource id already exist");
    }
    this.resourcesList.set(id, resource);
    return id;
  }

  get(id: resourceID) {
    return this.resourcesList.get(id);
  }

  size(): number {
    return this.resourcesList.size;
  }

  remove(id: resourceID) {
    this.resourcesList.delete(id);
  }

  getResourcesList() {
    return this.resourcesList;
  }

  attachResourceToAgent(agentID: agentID, resourceID: resourceID) {
    if (!this.resourcesList.get(resourceID)) {
      throw new Error("resource not exist.");
    }

    if (!agentID) {
      console.error("no agent id supplied");
      throw new Error("no agent id supplied");
    }

    const agent = this._agentsManager.get(agentID);

    if (!agent) {
      console.error("no agent found with agent id: ", agentID);
      throw new Error(`no agent found with agent id:  ${agentID}`);
    }
    console.info(
      `attaching agent with agentID: ${agentID} to resource with resourceID: ${resourceID}`
    );
    this._resourceAgentMap.set(resourceID, agent);

    // register resource protocol events TODO
    this.registerProtocolEvents(agent);
    return true;
  }

  // detachAgent(agent: Agent) {
  //   const agentID = agent.getID();
  //   console.info(`detaching agent with agentID: ${agentID} from all resources`);
  //   const resourcesToDetach = this.getResourcesByAgent(agentID);
  //   resourcesToDetach.forEach(rid => {
  //     this._resourceAgentMap.delete(rid);
  //   });
  //   console.info(`Detached ${resourcesToDetach.length} resources.`);
  // }

  detachResourceFromAgent(agent: Agent, resourceID: resourceID) {
    const agentID = agent.getID();
    console.info(
      `detaching agent with agentID: ${agentID} to resource with resourceID: ${resourceID}`
    );
    this._resourceAgentMap.delete(resourceID);

    this.unregisterProtocolEvents(agent);
  }

  registerProtocolEvents(agent: Agent) {
    try {
      this._protocolResponse.forEach(protocolAction => {
        agent.registerProtocolEvent(protocolAction);
      });
    } catch (err) {
      console.warn("could not load protocol. error: ", err);
      return;
    }
  }

  unregisterProtocolEvents(agent: Agent) {
    try {
      this._protocolResponse.forEach(protocolElement => {
        agent.unregisterProtocolEvent(protocolElement);
      });
    } catch (err) {
      console.warn("could not load protocol. error: ", err);
      return;
    }
  }

  getResourcesByAgent(agentID: agentID) {
    const resourcesToDetach = [];
    this._resourceAgentMap.forEach((value, key, map) => {
      if (value._id === agentID) {
        resourcesToDetach.push(key);
      }
    });
    return resourcesToDetach;
  }

  publishEvent(resourceID: resourceID, event: string, data) {
    const agent = this._resourceAgentMap.get(resourceID);
    if (!agent) {
      console.warn(
        `could not find agent that hold resource with resource id: ${resourceID}`
      );
      throw new Error("can not publish event. agent not found");
    }
    const action = this._protocolRequest.get(event);
    agent.publishEvent(action, data);
  }

  myResourceHandler() {}
}
