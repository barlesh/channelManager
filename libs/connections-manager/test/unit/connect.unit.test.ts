import "jest";
import {
  ConnectionManager,
  IConnectionManager,
  connectionServerManagerEvents
} from "../../src/connections";
import { channelSockets } from "../../src/models/sockets";
import { ioMock } from "../mock/io.mock";
import { mockResourceManager } from "./../../../resource-manager/test/mock";
import { mockAgentsManager } from "./../../../agents-manager/test/mock";
import { mockConnection } from "../mock";
import { ConnectionServer } from "../../src/connections/connections-server";
let serverIO;
const channelName = channelSockets.testSocketPath;
let myResourceMnager, myAgentMnager, myConnectionMnager;

describe("Demo", () => {
  let spy;
  beforeAll(done => {
    serverIO = ioMock;
    done();
  });

  beforeEach(() => {
    myResourceMnager = mockResourceManager;
    myAgentMnager = mockAgentsManager;
    myConnectionMnager = new ConnectionServer();
    myConnectionMnager.config({io: serverIO, channel: channelName});
  });

  afterEach(() => {
    // spy.clear();
  });

  test("receive connection request > test 1", () => {
    spy = jest.spyOn(myConnectionMnager, "emit");
    myConnectionMnager._nsp.generateEvent("connection");
    expect(myConnectionMnager._connectionsList.size).toBe(1);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      connectionServerManagerEvents.remoteConnected,
      mockConnection.id
    );
  });

  test("receive connection & disconnection request > test 1", () => {
    myConnectionMnager._nsp.generateEvent("connection");
    expect(myConnectionMnager._connectionsList.size).toBe(1);
    spy = jest.spyOn(myConnectionMnager, "emit");
    myConnectionMnager._nsp.generateEvent("disconnect");
    expect(myConnectionMnager._connectionsList.size).toBe(0);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      connectionServerManagerEvents.remoteDisconnected,
      mockConnection.id
    );
  });
});
