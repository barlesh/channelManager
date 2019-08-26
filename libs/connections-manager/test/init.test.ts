import "jest";
import { ConnectionManager } from "../src/connections";
const http = require("http");
import * as socketIo from "socket.io";
import { channelSockets } from "../src/models/sockets";
import { AgentsManager } from "../../agents-manager/src/agents";
import { ResourceManager } from "../../resource-manager/src/resources";
const express = require("express");

let httpServer, io;

describe("Demo", () => {
  beforeAll(done => {
    httpServer = http.createServer();
    io = socketIo(httpServer, { path: channelSockets.testSocketPath });
    done();
  });

  beforeEach(() => {});

  test("config connection manager > test 1", () => {
    const channelName = channelSockets.testSocketPath;
    const myConnectionMnager = new ConnectionManager();
    myConnectionMnager.config(io, channelName);
    expect(myConnectionMnager._socketServer).toEqual(io);
    expect(myConnectionMnager._channel).toEqual(channelName);
    expect(myConnectionMnager._nsp).toBeDefined();
  });
});
