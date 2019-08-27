import { agentID } from "../../src/types/types";
import { resourceID } from "../../../resource-manager/src/types/types";
import { connectionID } from "../../../connections-manager/src/models";
import { Agent } from "../../src/agents";
import { mockResourceManager } from "./resource-manager.mock";
import { mockConnectionManager } from "../../../connections-manager/test/mock";

const agentMap = new Map();
export const mockAgentsManager = {
  agentsList: agentMap,
  resourcesManager: mockResourceManager,
  connectionManager: mockConnectionManager,
  add: agent => {
    const id = "id";
    const a = new Agent(agent, mockAgentsManager);
    agentMap.set(id, a);
    return id;
  },
  get: (id): Agent => {
    return undefined;
  },
  registerResource: (agentID: agentID, resouceID: resourceID) => {},
  unregisterSource: (agentID: agentID, resouceID: resourceID) => {},
  getAgentConnection: (agentID: agentID): any => {},
  registerConnectionEvent: (conID: connectionID, action) => {},
  registerToAgentRegistrationEvents: connectionID => {},
  agentRegistration: (connectionID, agentData) => {},
  agentUnRegistration: data => {},
  registerAgentToResourcesEvents: (cid, aid) => {},
  remove: id => {},
  getAgentsList: (): Map<string, Agent> => {
    return agentMap;
  }
};
