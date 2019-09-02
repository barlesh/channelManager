import "jest";
import * as socketIo from "socket.io";
const io = require("socket.io-client");
const http = require("http");

import { ConnectionManager, ConnectionServer } from "../../../libs/connections-manager/src/connections";
import { protocolActionsList_simple } from "../lib/protocol/protocol.lib";
import { Master } from "./../../src/master/";
describe("Demo", () => {
  let myConnectionManager;
  let protocolActions;
  let httpServer;
  const socketPort = 3099;
  let client_socket;
  let serverIO;
  const cname = "myspace";

  let myMaster;
  let serverAddr = `http://localhost:${socketPort}/${cname}`;

  beforeAll(() => {
    httpServer = http.createServer().listen(socketPort);
    serverIO = socketIo(httpServer);
    myConnectionManager = new ConnectionServer();
    myConnectionManager.config({io: serverIO, channel: cname});
    protocolActions = protocolActionsList_simple;
    myMaster = new Master(myConnectionManager, protocolActions);
  });

  beforeEach(done => {
    serverAddr;

    done();
  });

  afterEach(done => {
    // Cleanup
    if (client_socket.connected) {
      client_socket.disconnect();
    }
    serverIO.close();
    client_socket.close();
    done();
  });

  test("connect to Master > test 1", () => {
    client_socket = io.connect(serverAddr, {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true
      // transports: ["websocket"]
    });

    // console.log(client_socket);
  });
});
