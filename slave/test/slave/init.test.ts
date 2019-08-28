import "jest";
import * as socketIo from "socket.io";
const io = require("socket.io-client");
const http = require("http");

import { ConnectionManager } from "./../../../libs/connections-manager/src/connections";
import { protocolActionsList_simple } from "../lib/protocol/protocol.lib";
import { Master } from "./../../src/master/";
describe("Demo", () => {
  let myConnectionManager;
  let protocolActions;
  let httpServer;
  const socketPort = 3099;
  let client_socket;
  let serverIO;
  const cname = "test";

  beforeAll(() => {
    httpServer = http.createServer().listen(socketPort);
    serverIO = socketIo(httpServer);
    myConnectionManager = new ConnectionManager();
    myConnectionManager.config(serverIO, cname);
  });

  afterAll((done)=>{
    serverIO.close();
    done();
  })

  test("attach agent to resource > test 1", () => {
    protocolActions = protocolActionsList_simple;
    const myMaster = new Master(myConnectionManager, protocolActions);
    expect(myMaster).toBeDefined();
  });
});
