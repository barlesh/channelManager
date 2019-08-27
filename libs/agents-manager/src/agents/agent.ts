import * as uid from "uuid";
import { AgentsManager, IAgentsManager } from "./agents-manager";
import { connectionID } from "../../../connections-manager/src/models";
import { agentID } from "../types/types";
import { protoAction } from "./../../../connections-manager/src/connections/protocol.actions";

export interface IAgent {
  _id;
  _connectionID;
  _manager;
  registerProtocolEvent(protocolAction: protoAction);
  unregisterProtocolEvent(protocolAction: protoAction);
  getID(): agentID;
}

export class Agent implements IAgent {
  _id;
  _connectionID: connectionID;
  _manager: IAgentsManager;

  constructor(agentObj, agentManager: IAgentsManager) {
    try {
      this._id = agentObj.agentID || uid();
    } catch (err) {
      console.warn(`did not received a propare agent oibject: ${agentObj}`);
      return;
    }
    this._connectionID = agentObj["connectionID"];
    this._manager = agentManager;
  }

  registerProtocolEvent(protocolAction: protoAction) {
    this._manager.registerConnectionEvent(this._connectionID, protocolAction);
  }

  unregisterProtocolEvent(protocolAction: protoAction) {
    console.warn(
      `need to un register action ${protocolAction} from agent ${this}, Currently not supported`
    );
    // TODO
  }

  publishEvent(protocolAction: protoAction, data){
    this._manager.publishEvent(this._connectionID, protocolAction, data);
  }

  getID() {
    return this._id;
  }
}
