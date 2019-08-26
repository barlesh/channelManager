import "jest";
import { Agent, AgentsManager } from "./../../src/agents";
import { ConnectionManager } from "../../../connections-manager/src/connections";
import { mockResourceManager } from "../mock/resource-manager.mock";
describe("Demo", () => {
  const protocol = [];
  const protocol_action_test = {
    event: "samle_event",
    handler: (data)=>{
      return data;
    } 
  }
  protocol.push(protocol_action_test);
  const myConnectionManager = new ConnectionManager();
  const resourceManager = mockResourceManager;
  const agentObj = {
    name: "aname",
    agentID: 1,
    connectionID: 1
  };
  const myAgentsManager = new AgentsManager(myConnectionManager, resourceManager)
  test("create agent class > test 1", () => {
    const agent = new Agent(agentObj, myAgentsManager);
    expect(agent.getID()).toEqual(agentObj.agentID);
  });
});
