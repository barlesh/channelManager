import "jest";
import { AgentsManager, AgentsManagerServer } from "../../src/agents";
import {
  ConnectionManager,
  IConnectionManager,
  ConnectionServer
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
  let myConnectionManager;
  let agentID: agentID;
  let myAgentsManager: AgentsManager;
  let myResourceManager;
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
    let protocolResponses = [];
    let protocolRequests = [];
    const ActionResponse = protocolActions.createProtocolActionResponse(
      event,
      e,
      retTrue,
      retFalse
    );
    const ActionRequest = protocolActions.createProtocolActionRequest(event);
    protocolResponses.push(ActionResponse);
    protocolRequests.push(ActionRequest);

    myConnectionManager = new ConnectionServer();
    myConnectionManager.config({ io: ioMock, channel: cname });
    myResourceManager = new ResourceManager(
      protocolResponses,
      protocolRequests
    );
    myAgentsManager = new AgentsManagerServer();
    myAgentsManager.config({
      connectionManager: myConnectionManager,
      resourceManager: myResourceManager
    });
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
