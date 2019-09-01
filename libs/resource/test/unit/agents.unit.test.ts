import "jest";
import * as uid from "uuid";
import { ResourceManager } from "../../src/resources";
import { Agent, AgentsManager } from "../../../agents-manager/src/agents";
import { mockConnectionManager } from "../../../connections-manager/test/mock";
import { mockAgentsManager } from "../../../agents-manager/test/mock";
import { agentID } from "../../../agents-manager/src/types/types";
import { protocolActions } from "../../../connections-manager/src/connections/protocol.actions";

describe("Demo", () => {
  let agent: Agent;
  let agentID: agentID;
  let myResourceManager: ResourceManager;
  let myConnectionManager;
  let myAgentManager;
  const uidSource: string = uid();
  const uidAgent: string = uid();
  let event;

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

  beforeEach(done => {
    const agentObj = {
      name: "aname",
      agentID: uidAgent
    };
    const resource = {
      name: "rname"
    };

    // myResourceManager = new ResourceManager(protocol, [{event: "hi"}]);
    myResourceManager = new ResourceManager(
      protocolResponses,
      protocolRequests
    );
    myConnectionManager = mockConnectionManager;
    myAgentManager = mockAgentsManager;
    myAgentManager.resourcesManager = myResourceManager;
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
    expect(myResourceManager.resourceAgentMap.get(uidSource)).toEqual(undefined);
    expect(spy).toHaveBeenCalled();
  });
});
