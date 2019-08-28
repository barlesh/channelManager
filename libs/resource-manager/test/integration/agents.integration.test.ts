import "jest";
import * as uid from "uuid";
import { ResourceManager } from "../../src/resources";
import { Agent, AgentsManager, AgentsManagerServer } from "../../../agents-manager/src/agents";
import {
  ioMock,
  mockConnection
} from "./../../../connections-manager/test/mock";
import { agentID } from "../../../agents-manager/src/types/types";
import { protocolActions } from "../../../connections-manager/src/connections/protocol.actions";
import {
  ConnectionManager,
  ConnectionServer
} from "../../../connections-manager/src/connections";

describe("Demo", () => {
  let agent: Agent;
  let agentID: agentID;
  let myResourceManager: ResourceManager;
  let myConnectionManager;
  let myAgentManager;
  const uidSource: string = uid();
  const uidAgent: string = uid();
  const cname = "channelname";

  const event = "samlpe event";
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

  beforeEach(done => {
    const agentObj = {
      name: "aname",
      agentID: uidAgent,
      connectionID: mockConnection.id
    };
    const resource = {
      name: "rname"
    };

    myResourceManager = new ResourceManager(protocol, []);
    myConnectionManager = new ConnectionServer();
    myConnectionManager.config({ io: ioMock, channel: cname });
    // incoming connection
    myConnectionManager.connectionHandler(myConnectionManager, mockConnection);
    myAgentManager = new AgentsManagerServer();
    myAgentManager.config({connectionManager: myConnectionManager, resourceManager:myResourceManager})

    myResourceManager.add(resource, uidSource);
    agentID = myAgentManager.add(agentObj);
    agent = myAgentManager.getAgentsList().get(agentID);
    done();
  });

  test("attach agent to resource > test 1", () => {
    const spy = jest.spyOn(myResourceManager, "registerProtocolEvents");
    myResourceManager.attachResourceToAgent(agent, uidSource);
    expect(myResourceManager.resourceAgentMap.get(uidSource)).toEqual(agent);
    expect(spy).toHaveBeenCalled();
  });

  test("detach agent from resource > test 2", () => {
    const spy = jest.spyOn(myResourceManager, "unregisterProtocolEvents");

    myResourceManager.attachResourceToAgent(agent, uidSource);
    myResourceManager.detachResourceFromAgent(agent, uidSource);
    expect(myResourceManager.resourceAgentMap.get(uidSource)).toEqual(
      undefined
    );
    expect(spy).toHaveBeenCalled();
  });
});
