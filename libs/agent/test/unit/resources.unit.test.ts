import "jest";
import { AgentsManager, AgentsManagerServer } from "../../src/agents";
import {
  ConnectionManager,
  IConnectionManager
} from "../../../connections-manager/src/connections";
import { protocolActions } from "../../../connections-manager/src/connections/protocol.actions";
import { mockResourceManager } from "../mock/resource-manager.mock";
import * as uid from "uuid";
import { IResourceManager } from "../../../resource-manager/src/resources";
import { agentID } from "../../src/types/types";
import {
  ioMock,
  mockConnectionManager,
  mockConnection
} from "../../../connections-manager/test/mock";

describe("Demo", () => {
  let myConnectionManager: IConnectionManager;
  let agentID: agentID;
  let myAgentsManager: AgentsManager;
  let myResourceMnager: IResourceManager;
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
    const Action = protocolActions.createProtocolActionResponse(
      event,
      e,
      retTrue,
      retFalse
    );
    protocol.push(Action);

    myConnectionManager = mockConnectionManager;
    myConnectionManager.config({io: ioMock, channel: cname});
    myResourceMnager = mockResourceManager;
    myAgentsManager = new AgentsManagerServer();
    myAgentsManager.config({
      connectionManager: myConnectionManager,
      resourceManager: myResourceMnager
    });
    agentID = myAgentsManager.add(agentObj);
  });

  test("attach agent to resource > test 1", () => {
    const resource = {
      name: "rname"
    };

    const rid: string = uid();
    myConnectionManager.setConnection(cid, mockConnection);
    mockResourceManager.add(resource, rid);
    myAgentsManager.registerResource(agentID, rid);
    expect(myResourceMnager.resourceAgentMap.size).toBe(1);
    const connID = myAgentsManager.get(agentID)._connectionID;
    const connection = myConnectionManager.getConnection(connID);
    expect(connection.listeners()).toContain(event);
  });
});
