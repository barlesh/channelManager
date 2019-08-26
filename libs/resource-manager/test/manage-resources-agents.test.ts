import "jest";
import * as uid from "uuid";
import { ResourceManager } from "../src/resources";
import { Agent, AgentsManager } from "./../../agents-manager/src/agents";
import { MockConnectionManager } from "./mock/connectionMnager.mock";
import { agentID } from "../../agents-manager/src/types/types";
import { protocolActions } from "../src/resources/protocol.validation";

describe("Demo", () => {
  let agent: Agent;
  let agentID: agentID;
  let myResourceMnager: ResourceManager;
  let myConnectionManager = new MockConnectionManager();
  let myAgentManager = new AgentsManager(myConnectionManager, myResourceMnager);
  const uidSource: string = uid();
  const uidAgent: string = uid();

  const event = "samlpe event";
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

  beforeEach(() => {
    const agentObj = {
      name: "aname",
      agentID: uidAgent
    };
    const resource = {
      name: "rname"
    };

    myResourceMnager = new ResourceManager(protocol);

    myResourceMnager.add(resource, uidSource);
    agentID = myAgentManager.add(agentObj);
    agent = myAgentManager.getAgentsList().get(agentID);

  });

  test("attach agent to resource > test 1", () => {
    const spy = jest.spyOn(myResourceMnager, "registerProtocolEvents");
    myResourceMnager.attachResourceToAgent(agent, uidSource);
    expect(myResourceMnager.resourceAgentMap.get(uidSource)).toEqual(
      agent.getID()
    );
    expect(spy).toHaveBeenCalled();
  });

  test("detach agent from resource > test 2", () => {
    const spy = jest.spyOn(myResourceMnager, "unregisterProtocolEvents");

    myResourceMnager.attachResourceToAgent(agent, uidSource);
    myResourceMnager.detachResourceFromAgent(agent, uidSource);
    expect(myResourceMnager.resourceAgentMap.get(uidSource)).toEqual(undefined);
    expect(spy).toHaveBeenCalled();
  });
});
