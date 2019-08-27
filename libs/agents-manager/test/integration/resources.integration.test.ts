import "jest";
import { AgentsManager } from "../../src/agents";
import {
  ConnectionManager,
  IConnectionManager
} from "../../../connections-manager/src/connections";
import { protocolActions } from "../../../connections-manager/src/connections/protocol.actions";
import * as uid from "uuid";
import {
  IResourceManager,
  ResourceManager
} from "../../../resource-manager/src/resources";
import { agentID } from "../../src/types/types";
import { ioMock, mockConnection } from "../../../connections-manager/test/mock";

describe("Demo", () => {
  let myConnectionManager: IConnectionManager;
  let agentID: agentID;
  let myAgentsManager: AgentsManager;
  let myResourceManager: IResourceManager;
  let event;
  const cname = "test";
  const cid = "a";

  beforeEach(() => {
    const agentObj = {
      name: "aname",
      connectionID: cid
    };

    event = "samlpe event";
    const e = data => {
      return data;
    };
    const retTrue = "sample return true event";
    const retFalse = "sample return false event";
    const protocol = [];
    const Action = protocolActions.createProtocolAction(
      event,
      e,
      retTrue,
      retFalse
    );
    protocol.push(Action);

    myConnectionManager = new ConnectionManager();
    myConnectionManager.config(ioMock, cname);
    myResourceManager = new ResourceManager(protocol);
    myAgentsManager = new AgentsManager(myConnectionManager, myResourceManager);
    agentID = myAgentsManager.add(agentObj);
  });

  test("attach agent to resource > test 1", () => {
    const resource = {
      name: "rname"
    };

    const rid: string = uid();
    myConnectionManager.setConnection(cid, mockConnection);
    myResourceManager.add(resource, rid);
    myAgentsManager.registerResource(agentID, rid);
    expect(myResourceManager.resourceAgentMap.size).toBe(1);
    const connID = myAgentsManager.get(agentID)._connectionID;
    const connection = myConnectionManager.getConnection(connID);
    expect(connection.listeners()).toContain(event);
  });
});
