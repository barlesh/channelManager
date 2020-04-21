import { connectionID } from "@resource-control/connection";
import {
  protocolActions,
  protoActionResponse,
  protoActionRequest
} from "@resource-control/protocol";
import { agentID } from "../types/types";
import { Agent } from "./agent";
import { EventEmitter } from "events";

export enum AgentsManagerEvents {
  agentRegistered = "agent-registered",
  agentUnRegistered = "agent-un-registered"
}

export interface IAgentsManager {
  add(data): agentID;
  get(id): any;
  getAgentConnection(agentID: agentID);
  registerConnectionEvent(conID: connectionID, action: protoActionResponse);
  publishEvent(conID: connectionID, protocolAction, data);
  config(configuration: any);
}

export abstract class AgentsManager implements IAgentsManager {
  agentsList: Map<agentID, Agent>;
  connectionManager; //: IConnectionManager;
  eve = new EventEmitter();

  on(eventType: string, func) {
    this.eve.on(eventType, func);
  }

  emit(eventType: string, data?) {
    this.eve.emit(eventType, data);
  }
  abstract config(conf);

  /* events handlers */
  agentRegistration(connectionID, agentData) {
    // validate agent data
    // TODO
    //attach connection id to the validated agent data
    // // create new agent
    const agentID = this.createAgent(agentData, connectionID);
    // register the agents events to the connection object
    this.registerAgentsEvents(connectionID, agentID);
    this.emit(AgentsManagerEvents.agentRegistered, agentID);
    return true;
  }

  registerAgentsEvents(connectionID, agentID) {
    const Action = protocolActions.createProtocolActionResponse(
      "disconnect",
      this.agentDisconnection.bind(this, agentID),
      undefined,
      undefined
    );
    this.connectionManager.subscribeToConnectionEvent(connectionID, Action);
  }

  agentUnRegistration(connstionID: connectionID) {
    // remove the agent with the attached connection ID - TODO
    // console.warn("currently not supported");
    return false;
  }

  agentDisconnection(agentID: agentID, _disconnectionMsg) {
    return this.removeAgent(agentID);
  }

  /* Class methods */
  createAgent(agentData, connectionID: connectionID) {
    // console.log(
    //   `creating agent. agentData: ${agentData}, agent id: ${agentData.id}. connectionID: ${connectionID}`
    // );
    agentData["connectionID"] = connectionID;
    // create new agent
    return this.add(agentData);
  }

  removeAgent(agentID) {
    // console.log(
    //   `removing agent wth agent id: ${agentID}.`
    // );
    if (!agentID) {
      // console.error(
      //   "received agent disconnection event without agent id. cannot disconnect agent"
      // );
      throw new Error("failed to disconnect agent");
    }
    this.remove(agentID);
    this.emit(AgentsManagerEvents.agentUnRegistered, agentID);
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
      // console.warn(
      //   `agent with id: ${aid} already exist. replacing old agent with the new agent (temppp)`
      // );
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

  /* events */

  registerConnectionEvent(
    conID: connectionID,
    protocolAction: protoActionResponse
  ) {
    this.connectionManager.subscribeToConnectionEvent(conID, protocolAction);
  }

  async publishEvent(
    conID: connectionID,
    protocolAction: protoActionRequest,
    data
  ) {
    await this.connectionManager.publishConnectionEvent(
      conID,
      protocolAction,
      data
    );
  }
}
