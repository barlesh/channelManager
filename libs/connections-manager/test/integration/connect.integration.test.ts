import "jest";
import {
  ConnectionManager,
  IConnectionManager,
  connectionManagerEvents
} from "../../src/connections";
import { channelSockets } from "../../src/models/sockets";
import { ioMock } from "../mock/io.mock";
import { mockResourceManager } from "../../../resource-manager/test/mock";
import { mockAgentsManager } from "../../../agents-manager/test/mock";
import { mockConnection } from "../mock";
import { AgentsManager } from "../../../agents-manager/src/agents";
import { agentsProtocolEvents } from "../../src/protocol";
import { resourceProtocolEvents } from "../../../agents-manager/src/protocol/resource.protocol";
let serverIO;
const channelName = channelSockets.testSocketPath;
let myResourceMnager, myAgentMnager: AgentsManager, myConnectionMnager;

describe("Demo", () => {
  let spy;
  beforeAll(done => {
    serverIO = ioMock;
    done();
  });

  beforeEach(() => {
    myResourceMnager = mockResourceManager;
    myConnectionMnager = new ConnectionManager();
    myConnectionMnager.config(serverIO, channelName);
    myAgentMnager = new AgentsManager(myConnectionMnager, myResourceMnager);
  });

  afterEach(() => {
    // spy.clear();
  });

  test("receive connection request > test 1", () => {
    const agentObj = {
      name: "aname"
    }
    spy = jest.spyOn(myConnectionMnager, "emit");
    myConnectionMnager._nsp.generateEvent("connection");
    const conn = myConnectionMnager._connectionsList.get(mockConnection.id);
    conn.generateEvent(agentsProtocolEvents.agentRegister, agentObj);

    expect(myAgentMnager.agentsList.size).toEqual(1);
    expect(conn.listeners()).toContain(resourceProtocolEvents.resourceAttach);
    expect(conn.listeners()).toContain(resourceProtocolEvents.resourceAttach);

    
  });

  // test("receive connection & disconnection request > test 1", () => {
  //   myConnectionMnager._nsp.generateEvent("connection");
  //   expect(myConnectionMnager._connectionsList.size).toBe(1);
  //   spy = jest.spyOn(myConnectionMnager, "emit");
  //   myConnectionMnager._nsp.generateEvent("disconnect");
  //   expect(myConnectionMnager._connectionsList.size).toBe(0);
  //   expect(spy).toHaveBeenCalled();
  //   expect(spy).toHaveBeenCalledWith(
  //     connectionManagerEvents.remoteDisconnected,
  //     mockConnection.id
  //   );
  // });
});
