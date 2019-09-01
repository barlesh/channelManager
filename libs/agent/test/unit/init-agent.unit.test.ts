import "jest";
import { Agent } from "../../src/agents";
import { mockAgentsManager } from "./../mock";
describe("Demo", () => {
  const protocol = [];
  const protocol_action_test = {
    event: "samle_event",
    handler: data => {
      return data;
    }
  };
  protocol.push(protocol_action_test);
  // const myConnectionManager = mockConnectionManager;
  // const resourceManager = mockResourceManager;
  const agentObj = {
    name: "aname",
    id: 1,
    connectionID: 1
  };
  const myAgentsManager = mockAgentsManager; //new AgentsManager(myConnectionManager, resourceManager)
  test("create agent class > test 1", () => {
    const agent = new Agent(agentObj, myAgentsManager);
    expect(agent.getID()).toEqual(agentObj.id);
  });
});
