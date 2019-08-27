import "jest";
import { ConnectionManager } from "../../src/connections";
const http = require("http");
import * as socketIo from "socket.io";
import { channelSockets } from "../../src/models/sockets";
import { ioMock } from "../mock/io.mock";
import { ConnectionServer } from "../../src/connections/connections-server";

let httpServer, io;

describe("Demo", () => {
  beforeAll(done => {
    io = ioMock;
    done();
  });

  beforeEach(() => {});

  test("config connection manager > test 1", () => {
    const channel = channelSockets.testSocketPath;
    const myConnectionMnager = new ConnectionServer();
    myConnectionMnager.config({io, channel});
    expect(myConnectionMnager._socketServer).toEqual(io);
    expect(myConnectionMnager._channel).toEqual(channel);
    expect(myConnectionMnager._nsp).toBeDefined();
  });
});
