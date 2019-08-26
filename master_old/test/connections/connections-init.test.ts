import "jest";
const http = require("http");
import * as socketIo from "socket.io";
const express = require("express");

import { ConnectionManager } from "../../src/channelConnections";
import { channelNamespaces } from "../models/namespaces";
import { channelSockets } from "../models/sockets";

let httpServer, io;

describe("Demo", () => {
  beforeAll(done => {
    httpServer = http.createServer();
    io = socketIo(httpServer, { path: channelSockets.testSocketPath });
    done();
  });

  afterAll(done => {
    io.close();
    httpServer.close();
    done();
  });

  beforeEach(() => {});

  test("init connection manager socket - no io > test 1", () => {
    const io = undefined;
    const connectionMnager = new ConnectionManager();
    const init = a => connectionMnager.init(io);
    expect(init).toThrow("io not supplied");
  });

  test("init connection manager socket > test 2", () => {
    const connectionMnager = new ConnectionManager();
    connectionMnager.init(io);
    expect(connectionMnager.io).toBeDefined();
  });
});
