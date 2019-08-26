import "jest";
import { AgentsManager } from "./../src/agents/agents-manager"
import { ConnectionManager } from "./../../connections-manager/src/connections";
import { ResourceManager } from "./../../resource-manager/src/resources"
import { mockResourceManager } from "./mock/resource-manager.mock";
describe("Demo", () => {
  const protocol = [];
  const protocol_action_test = {
    event: "samle_event",
    handler: (data)=>{
      return data;
    } 
  }
  protocol.push(protocol_action_test);
  
  test("create resource manager > test 1", () => {
    const connectionMnager = new ConnectionManager();
    const resouceManager = mockResourceManager;
    const manager = new AgentsManager(connectionMnager, resouceManager);
    expect(manager.getAgentsList().size).toEqual(0);
  });
});
