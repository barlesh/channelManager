import "jest";
const http = require("http");
import * as socketIo from 'socket.io';
const express = require("express");

import { ConnectionManager } from "../../src/channelConnections";
import { channelNamespaces } from "../models/namespaces";
import { channelSockets } from "../models/sockets";

let app, httpServer, io;

describe("Demo", () => {

  test("create connection manager > test 1", () => {
    const connectionMnager = new ConnectionManager();
    expect(connectionMnager.io).not.toBeDefined();
    expect(Object.keys(connectionMnager.channels).length).toEqual(0);
  });
});
