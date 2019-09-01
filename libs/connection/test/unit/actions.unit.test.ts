import "jest";
import { ConnectionManager } from "../../src/connections";
import { channelSockets } from "../../src/models/sockets";
import * as uid from "uuid";
import { exampleActionResponse } from "./../../../resource-manager/test/lib/";

let serverIO;
let myConnectionMnager: ConnectionManager, myAgentMnager;
const channelName = channelSockets.testSocketPath;

import { mockConnection } from "../mock/connection.mock";
import { ioMock } from "../mock/io.mock";
import { ConnectionServer } from "../../src/connections/connections-server";

describe("Demo", () => {
  let spy;

  beforeAll(done => {
    serverIO = ioMock;
    done();
  });

  beforeEach(() => {
    myConnectionMnager = new ConnectionServer();
    myConnectionMnager.config({io: serverIO, channel: channelName});

  });

  afterEach(() => {
    spy.mockClear();
  });

  test("register protocol action  > test 1", () => {
    const cid = uid();
    const connection = mockConnection;
    myConnectionMnager.setConnection(cid, connection);

    const Action = exampleActionResponse;

    spy = jest.spyOn(connection, "on");
    // const spyOfEmit = jest.spyOn(connection, "emit");
    myConnectionMnager.subscribeToConnectionEvent(cid, Action);
    expect(spy).toHaveBeenCalled();
    // expect(spy).toHaveBeenCalledWith(event);
  });

  test("test handler (exec) execution upon event  > test 2", () => {
    const cid = uid();
    const connection = mockConnection;
    myConnectionMnager.setConnection(cid, connection);
    const Action = exampleActionResponse;

    spy = jest.spyOn(Action, "exec");
    myConnectionMnager.subscribeToConnectionEvent(cid, Action);
    connection.generateEvent(Action.event);
    expect(spy).toHaveBeenCalled();
  });

  // test("test emmiting false answer upon event  > test 3", () => {
  //   const cid = uid();
  //   const connection = mockConnection;
  //   myConnectionMnager.setConnection(cid, connection);

  //   const event = "samlpe event";
  //   const e = data => {
  //     return false;
  //   };
  //   const retTrue = "sample return true event";
  //   const retFalse = "sample return false event";
  //   const protocol = [];
  //   const Action = protocolActions.createProtocolAction(
  //     event,
  //     e,
  //     retTrue,
  //     retFalse
  //   );
  //   protocol.push(Action);

  //   spy = jest.spyOn(connection, "emit");
  //   console.log(`connection emit is: ${connection.emit}`);
  //   myConnectionMnager.registerConnectionEvent(cid, Action);
  //   connection.generateEvent(event);
  //   expect(spy).toHaveBeenCalled();
  //   expect(spy).toBeCalledWith([retFalse]);
  // });

  // test("test emmiting truth answer upon event  > test 4", () => {
  //   const cid = uid();
  //   const connection = mockConnection;
  //   myConnectionMnager.setConnection(cid, connection);

  //   const event = "samlpe event";
  //   const e = data => {
  //     return true;
  //   };
  //   const retTrue = "sample return true event";
  //   const retFalse = "sample return false event";
  //   const protocol = [];
  //   const Action = protocolActions.createProtocolAction(
  //     event,
  //     e,
  //     retTrue,
  //     retFalse
  //   );
  //   protocol.push(Action);

  //   spy = jest.spyOn(connection, "emit");
  //   console.log(`connection emit is: ${connection.emit}`);
  //   myConnectionMnager.registerConnectionEvent(cid, Action);
  //   connection.generateEvent(event);
  //   expect(spy).toHaveBeenCalled();
  //   expect(spy).toBeCalledWith([retTrue]);
  // });
});
