import { resourceID } from "../types/types";
import { Agent } from "../../../agents-manager/src/agents";
import {
  protocolActions,
  protoActionResponse,
  protoActionRequest
} from "../../../connections-manager/src/connections/protocol.actions";
import * as uid from "uuid";

export interface IResourceManager {
  _protocolResponse: protoActionResponse[];
  _protocolRequest: Map<string, protoActionRequest>;
  resourceAgentMap: Map<resourceID, Agent>;
  add(data, id?): resourceID;
  get(id): any;
  size(): number;
  attachResourceToAgent(agent: Agent, resourceID: resourceID);
  detachResourceFromAgent(agent: Agent, resourceID: resourceID);
  publishEvent(resourceID: resourceID, event: string, data);
}

export class ResourceManager implements IResourceManager {
  resourcesList: Map<resourceID, any>;
  resourceAgentMap: Map<resourceID, Agent>;
  _protocolResponse: protoActionResponse[];
  _protocolRequest: Map<string, protoActionRequest>;

  constructor(responses: protoActionResponse[], requests: protoActionRequest[]) {
    if (protocolActions.validateProtocolActionResponse(responses)) {
      this._protocolResponse = responses;
    } else {
      throw new Error("response protocol of bad type");
    }
    this._protocolRequest= new Map();
    console.log("calling validateProtocolActionRequest with req object: ", requests)
    if (protocolActions.validateProtocolActionRequest(requests)) {
      this.loadRequestsToMap(requests);
    } else {
      throw new Error("request protocol of bad type");
    }
    this.resourcesList = new Map();
    this.resourceAgentMap = new Map();
  }

  loadRequestsToMap(actionRequests: protoActionRequest[]){
    actionRequests.forEach((action)=>{
      this._protocolRequest.set(action.event, action);
    })
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

  attachResourceToAgent(agent: Agent, resourceID: resourceID) {
    if (!this.resourcesList.get(resourceID)) {
      throw new Error("resource not exist.");
    }
    if (!agent) {
      console.error("no agent supplied");
      throw new Error("no agent supplied");
    }

    const agentID = agent.getID();
    if (!agentID) {
      console.error("no agent id supplied in object: ", agent);
      throw new Error("no agent id supplied in agent object");
    }
    console.info(
      `attaching agent with agentID: ${agentID} to resource with resourceID: ${resourceID}`
    );
    this.resourceAgentMap.set(resourceID, agent);

    // register resource protocol events TODO
    this.registerProtocolEvents(agent);
  }

  detachResourceFromAgent(agent: Agent, resourceID: resourceID) {
    const agentID = agent.getID();
    console.info(
      `detaching agent with agentID: ${agentID} to resource with resourceID: ${resourceID}`
    );
    this.resourceAgentMap.delete(resourceID);

    this.unregisterProtocolEvents(agent);
  }

  registerProtocolEvents(agent: Agent) {
    try {
      this._protocolResponse.forEach(protocolAction => {
        // console.log(`registering protocol action :${protocolAction} to agent: ${agent}`)
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

  publishEvent(resourceID: resourceID, event: string, data){
    const agent = this.resourceAgentMap.get(resourceID);
    const action = this._protocolRequest.get(event);
    agent.publishEvent(action, data);


  }

  myResourceHandler() {}
}
