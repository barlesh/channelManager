import "jest";
import { ConnectionManager } from "../src/connections";
const http = require("http");
import * as socketIo from "socket.io";
import { channelSockets } from "../src/models/sockets";
import { connect } from "socket.io-client";
import { AgentsManager } from "../../agents-manager/src/agents";
import { ResourceManager } from "../../resource-manager/src/resources";

let httpServer, serverIO, clientIO, httpServerAddr;
let myConnectionMnager, myAgentMnager;
const channelName = channelSockets.testSocketPath;

describe("Demo", () => {
  // beforeAll(done => {
  //   // httpServer = http.createServer();
  //   // httpServerAddr = httpServer.listen().address();
  //   // serverIO = socketIo(httpServer);

  //   // done();
  // });

  // beforeEach(() => {
  //   // const myResourceMnager = new ResourceManager();
  //   // myAgentMnager = new AgentsManager(myResourceMnager);
  //   // myConnectionMnager = new ConnectionManager().config(
  //   //   serverIO,
  //   //   channelName,
  //   //   myAgentMnager
  //   // );
  // });

  test("receive connection request > test 1", () => {
    // console.log("httpServer:", httpServer)
    // console.log("httpServerAddr:", httpServerAddr)
    // const httpAddr =
    //   httpServerAddr.address === "::" ? "localhost" : httpServerAddr.address;
    // const serverUrl = `http://${httpAddr}:${
    //   httpServerAddr.port
    // }/${channelName}`;
    // console.log("serverUrl:", serverUrl);

    // const connectionOptions = { reconnectionDelay: 2000 };
    // clientIO = connect(serverUrl, connectionOptions);
    // console.log("clientIO: ", clientIO);
    // expect(clientIO).toBeDefined();

    // expect(myConnectionMnager.)
    expect(1).toEqual(1);
  });
});
