import "jest";
import { AgentsManager, Agent } from "../src/agents";
import { ResourceManager } from "../../resource-manager/src/resources";
import { ConnectionManager } from "../../connections-manager/src/connections";
import { agentID } from "../src/types/types";
import { protocolActions } from "../../resource-manager/src/resources/protocol.validation";
import { mockResourceManager } from "./mock/resource-manager.mock";
describe("Demo", () => {
  const resourceManager = mockResourceManager;
  const myConnectionMnager = new ConnectionManager();
  const simpleAgent = {
    name: "aname"
  };

  let manager: AgentsManager;
  let agent: Agent;
  let agentID: agentID;
  beforeEach(() => {
    manager = new AgentsManager(myConnectionMnager, resourceManager);
    agentID = manager.add(simpleAgent);
  });

  test("add resource > test 1", () => {
    expect(manager.getAgentsList().size).toEqual(1);
  });

  // test("remove resource > test 1", () => {
  //   // const rid = manager.add(simpleAgent);
  //   // expect(manager.getResourcesList().size).toEqual(1);
  //   // manager.remove(rid);
  //   // expect(manager.getResourcesList().size).toEqual(0);
  // });

  // test("register source to agent > test 2", () => {
  //   const resourceID = "1";
  //   manager.registerResource(agentID, resourceID);
  // });
});
