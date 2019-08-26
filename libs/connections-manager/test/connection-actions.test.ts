import "jest";
import { ConnectionManager } from "../src/connections";
const http = require("http");
import * as socketIo from "socket.io";
import { channelSockets } from "../src/models/sockets";
import { connect } from "socket.io-client";
import { AgentsManager } from "../../agents-manager/src/agents";
import { ResourceManager } from "../../resource-manager/src/resources";
import * as uid from "uuid";

let httpServer, serverIO, clientIO, httpServerAddr;
let myConnectionMnager: ConnectionManager, myAgentMnager;
const channelName = channelSockets.testSocketPath;

import { mockConnection } from "./mock/connection.mock";
import { protocolActions } from "../src/connections/protocol.actions";

describe("Demo", () => {
  let spy;
  beforeAll(done => {
    httpServer = http.createServer();
    serverIO = socketIo(httpServer);
    done();
  });

  beforeEach(() => {
    myConnectionMnager = new ConnectionManager();
    myConnectionMnager.config(serverIO, channelName);
  });

  afterEach(() => {
    spy.mockClear();
  });

  test("register protocol action  > test 1", () => {
    const cid = uid();
    const connection = mockConnection;
    myConnectionMnager.setConnection(cid, connection);

    const event = "samlpe event";
    const e = data => {
      return data;
    };
    const retTrue = "sample return true event";
    const retFalse = "sample return false event";
    const protocol = [];
    const Action = protocolActions.createProtocolAction(
      event,
      e,
      retTrue,
      retFalse
    );
    protocol.push(Action);

    spy = jest.spyOn(connection, "on");
    // const spyOfEmit = jest.spyOn(connection, "emit");
    myConnectionMnager.registerConnectionEvent(cid, Action);
    expect(spy).toHaveBeenCalled();
    // expect(spy).toHaveBeenCalledWith(event);
  });

  test("test handler (exec) execution upon event  > test 2", () => {
    const cid = uid();
    const connection = mockConnection;
    myConnectionMnager.setConnection(cid, connection);

    const event = "samlpe event";
    const e = data => {
      return false;
    };
    const retTrue = "sample return true event";
    const retFalse = "sample return false event";
    const protocol = [];
    const Action = protocolActions.createProtocolAction(
      event,
      e,
      retTrue,
      retFalse
    );
    protocol.push(Action);

    spy = jest.spyOn(Action, "exec");
    myConnectionMnager.registerConnectionEvent(cid, Action);
    connection.generateEvent(event);
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
