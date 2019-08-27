import { resourceID } from "../types/types";
import { agentID } from "../../../agents-manager/src/types/types";
import { Agent } from "../../../agents-manager/src/agents";
import {
  protocolActions,
  protoAction
} from "../../../connections-manager/src/connections/protocol.actions";
import * as uid from "uuid";

export interface IResourceManager {
  resourceAgentMap: Map<resourceID, agentID>;
  add(data, id?): resourceID;
  get(id): any;
  size(): number;
  attachResourceToAgent(agent: Agent, resourceID: resourceID);
  detachResourceFromAgent(agent: Agent, resourceID: resourceID);
}

export class ResourceManager implements IResourceManager {
  resourcesList: Map<resourceID, any>;
  resourceAgentMap: Map<resourceID, agentID>;
  _protocol: protoAction[];

  constructor(protocol: protoAction[]) {
    if (protocolActions.validate_protocol_obj(protocol)) {
      // need validation
      this._protocol = protocol;
    } else {
      throw new Error("protocol of bad type");
    }
    this.resourcesList = new Map();
    this.resourceAgentMap = new Map();
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
    this.resourceAgentMap.set(resourceID, agentID);

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
      this._protocol.forEach(protocolAction => {
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
      this._protocol.forEach(protocolElement => {
        agent.unregisterProtocolEvent(protocolElement);
      });
    } catch (err) {
      console.warn("could not load protocol. error: ", err);
      return;
    }
  }

  publishEvent(resourceID: resourceID, event: string){
    const agentID = this.resourceAgentMap.get(resourceID);
    

  }

  myResourceHandler() {}
}
