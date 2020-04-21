import * as uid from "uuid";
import { AgentsManager } from "./agents-manager";
import { connectionID } from "@resource-control/connection";
import { agentID } from "../types/types";
import {
  protoActionResponse,
  protoActionRequest
} from "@resource-control/protocol";

export interface IAgent {
  _id;
  _connectionID;
  _manager;
  registerProtocolEvent(protocolAction: protoActionResponse);
  unregisterProtocolEvent(protocolAction: protoActionResponse);
  getID(): agentID;
}

export class Agent implements IAgent {
  _id;
  _connectionID: connectionID;
  _manager: AgentsManager;

  constructor(agentObj, agentManager: AgentsManager) {
    try {
      const received_id = agentObj["id"];
      this._id = received_id ? received_id : uid();
    } catch (err) {
      // console.error( `did not received a propare agent object: ${agentObj}. error: `,  err);
      return;
    }
    const connectionID = agentObj["connectionID"];
    if (!connectionID) {
      // console.error(
      //   "agent object does not hold connection ID. We will not be able to connect with it. cannot create agent."
      // );
      throw new Error("connection id missing.");
    }
    this._connectionID = connectionID;
    this._manager = agentManager;
  }

  registerProtocolEvent(protocolAction: protoActionResponse) {
    this._manager.registerConnectionEvent(this._connectionID, protocolAction);
  }

  unregisterProtocolEvent(protocolAction: protoActionResponse) {
    // // console.warn(
    //   `need to un register action ${protocolAction} from agent ${this}, Currently not supported`
    // );
    // TODO
  }

  async publishEvent(protocolAction: protoActionRequest, data) {
    await this._manager.publishEvent(this._connectionID, protocolAction, data);
  }

  getID() {
    return this._id;
  }
}
