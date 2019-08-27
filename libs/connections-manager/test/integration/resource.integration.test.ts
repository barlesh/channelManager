import "jest";
import {
  ConnectionManager,
} from "../../src/connections";
import { channelSockets } from "../../src/models/sockets";
import { ioMock } from "../mock/io.mock";
import { mockConnection } from "../mock";
import { AgentsManager } from "../../../agents-manager/src/agents";
import { agentsProtocolEvents } from "../../src/protocol";
import { resourceProtocolEvents } from "../../../agents-manager/src/protocol/resource.protocol";
import { ResourceManager } from "../../../resource-manager/src/resources";
import { exampleProtocol } from "../../../resource-manager/test/lib";
import { ConnectionServer } from "../../src/connections/connections-server";
let serverIO;
const channelName = channelSockets.testSocketPath;
let myResourceMnager: ResourceManager, myAgentMnager: AgentsManager, myConnectionMnager;

describe("Demo", () => {
  let spy, conn;
  beforeAll(done => {
    serverIO = ioMock;
    done();
  });

  beforeEach(() => {
    // connection manager init
    // connection attampt
    // agent registration
    myResourceMnager = new ResourceManager(exampleProtocol);
    myConnectionMnager = new ConnectionServer();
    myConnectionMnager.config({io: serverIO, channel: channelName});
    myAgentMnager = new AgentsManager(myConnectionMnager, myResourceMnager);
    const agentObj = {
      name: "aname"
    }
    myConnectionMnager._nsp.generateEvent("connection");
    conn = myConnectionMnager._connectionsList.get(mockConnection.id);
    conn.generateEvent(agentsProtocolEvents.agentRegister, agentObj);
  });

  afterEach(() => {
    // spy.clear();
  });

  test("receive resource attach request > test 1", () => {
    const resource = {
      name: "rname"
    }

    const rid = myResourceMnager.add(resource);
    conn.generateEvent(resourceProtocolEvents.resourceAttach, rid);

    // check that the resource is attached to a real agent
    const agentID = myResourceMnager.resourceAgentMap.get(rid);
    expect(myAgentMnager.agentsList.get(agentID)).toBeDefined()
    // expect the registration of the resource manager protocol actions in connection
    expect(conn.listeners()).toContain(exampleProtocol[0].event);

    
  });

  test("receive resource dettach request > test 1", () => {
    const resource = {
      name: "rname"
    }

    const rid = myResourceMnager.add(resource);
    conn.generateEvent(resourceProtocolEvents.resourceAttach, rid);
    conn.generateEvent(resourceProtocolEvents.resouceDetach, rid);

    // expect the registration of the resource manager protocol actions in connection
    const agentID = myResourceMnager.resourceAgentMap.get(rid);
    expect(agentID).not.toBeDefined()
    
  });
});
