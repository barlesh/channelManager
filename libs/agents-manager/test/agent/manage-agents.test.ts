import "jest";
import { Agent, AgentsManager } from "../../src/agents";
import * as uid from "uuid";
import { ResourceManager } from "../../../resource-manager/src/resources";
import { ConnectionManager } from "../../../connections-manager/src/connections";
import { protocolActions } from "../../../resource-manager/src/resources/protocol.validation";
import { mockResourceManager } from "../mock/resource-manager.mock";

describe("Demo", () => {
  let agent;

  beforeEach(() => {
    const agentObj = {
      name: "aname"
    };
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

    const myConnectionManager = new ConnectionManager();
    const myResourceMnager = mockResourceManager;
    const myAgentsManager = new AgentsManager(
      myConnectionManager,
      myResourceMnager
    );
    agent = new Agent(agentObj, myAgentsManager);
  });

  test("add resource > test 1", () => {
    // const resource = {
    //   name: "rname"
    // };
    // const uidS: string = uid();
    // agent.addResource(resource, uidS);
    // expect(agent.resources.size()).toEqual(1);
    // expect(agent.getResource(uidS)).toEqual(resource);
  });
});
