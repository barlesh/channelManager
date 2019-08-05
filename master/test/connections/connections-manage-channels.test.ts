import "jest";
const http = require("http");
import * as socketIo from "socket.io";
const express = require("express");

import { ConnectionManager } from "../../src/channelConnections";
import { channelNamespaces } from "../models/namespaces";
import { channelSockets } from "../models/sockets";
import { channelEvents } from "../models/events";

let httpServer, io;
let connectionManager: ConnectionManager;

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

  beforeEach(() => {
    connectionManager = new ConnectionManager();
    connectionManager.init(io);
  });

  test("create new channel - no channelname > test 1", () => {
    const name = "";
    const f = () => connectionManager.initChannel(name);
    expect(f).toThrow("wrong channel name");
  });

  test("create new channel > test 1", () => {
    const cn = channelNamespaces.testNS;
    connectionManager.initChannel(cn);
    expect(connectionManager.channels[cn]).toEqual(cn);
  });

  // test("register event no name > test 1", () => {
  //   let eventName;
  //   const eventCallBack = () => {};
  //   const ce_no_name = { name: eventName, cb: eventCallBack };
  //   const registerEventNoName = (a) => connectionMnager.registerEventHandler(ce_no_name);
  //   expect(registerEventNoName).toThrow("wrong event type");

  //   const ce_no_cb = { name: channelEvents.testEventName, cb: undefined };
  //   const registerEventNoCB = (a) => connectionMnager.registerEventHandler(ce_no_cb);
  //   expect(registerEventNoCB).toThrow("wrong event type");
  // });
});
