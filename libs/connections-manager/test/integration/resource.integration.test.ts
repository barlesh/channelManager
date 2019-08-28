import "jest";
import { ConnectionManager } from "../../src/connections";
import { channelSockets } from "../../src/models/sockets";
import { ioMock } from "../mock/io.mock";
import { mockConnection } from "../mock";
import { AgentsManagerServer } from "../../../agents-manager/src/agents";
import { agentsProtocolEvents } from "../../src/protocol";
import { resourceProtocolEvents } from "../../../agents-manager/src/protocol/resource.protocol";
import { ResourceManager } from "../../../resource-manager/src/resources";
import {
  exampleProtocolResponses,
  exampleProtocolRequests
} from "../../../resource-manager/test/lib";
import { ConnectionServer } from "../../src/connections/connections-server";
let serverIO;
const channelName = channelSockets.testSocketPath;
let myResourceMnager: ResourceManager,
  myAgentMnager: AgentsManagerServer,
  myConnectionMnager;

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
    myResourceMnager = new ResourceManager(
      exampleProtocolResponses,
      exampleProtocolRequests
    );
    myConnectionMnager = new ConnectionServer();
    myConnectionMnager.config({ io: serverIO, channel: channelName });
    myAgentMnager = new AgentsManagerServer();
    myAgentMnager.config({
      connectionManager: myConnectionMnager,
      resourceManager: myResourceMnager
    });
    const agentObj = {
      name: "aname"
    };
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
    };

    const rid = myResourceMnager.add(resource);
    conn.generateEvent(resourceProtocolEvents.resourceAttach, rid);

    // check that the resource is attached to a real agent
    const agent = myResourceMnager.resourceAgentMap.get(rid);
    expect(agent).toBeDefined();
    // expect the registration of the resource manager protocol actions in connection
    expect(conn.listeners()).toContain(exampleProtocolResponses[0].event);
  });

  test("receive resource dettach request > test 1", () => {
    const resource = {
      name: "rname"
    };

    const rid = myResourceMnager.add(resource);
    conn.generateEvent(resourceProtocolEvents.resourceAttach, rid);
    conn.generateEvent(resourceProtocolEvents.resouceDetach, rid);

    // expect the registration of the resource manager protocol actions in connection
    const agentID = myResourceMnager.resourceAgentMap.get(rid);
    expect(agentID).not.toBeDefined();
  });
});
