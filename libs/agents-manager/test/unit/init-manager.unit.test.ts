import "jest";
import { AgentsManager } from "../../src/agents/agents-manager"
import { mockResourceManager } from "../mock/resource-manager.mock";
import { mockConnectionManager } from "../../../connections-manager/test/mock";
describe("Demo", () => {
  const protocol = [];
  const protocol_action_test = {
    event: "samle_event",
    handler: (data)=>{
      return data;
    } 
  }
  protocol.push(protocol_action_test);
  
  test("create agents manager > test 1", () => {
    const myConnectionMnager = mockConnectionManager;
    const myResouceManager = mockResourceManager;
    const manager = new AgentsManager(myConnectionMnager, myResouceManager);
    expect(manager.getAgentsList().size).toEqual(0);
  });
});
