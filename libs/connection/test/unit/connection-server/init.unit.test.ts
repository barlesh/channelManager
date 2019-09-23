import "jest";
import { ConnectionManager } from "../../../src/connections";
const http = require("http");
import * as socketIo from "socket.io";
import { channelSockets } from "../../../src/models/sockets";
import { ioMock } from "../../mock/io-manager-server.mock";
import { ConnectionServer } from "../../../src/connections/connections-server";
import { connectionEvents } from "../../../src/connections/connectionEvents";
import { protocolActions } from "../../../../protocol/src/actions";

let httpServer, io;

describe("Demo", () => {
  beforeAll(done => {
    io = ioMock;
    done();
  });

  beforeEach(() => {});

  test("config connection manager server > test 1", () => {
    const channel = channelSockets.testSocketPath;
    const myConnectionMnager = new ConnectionServer();
    const spy = jest.spyOn(io, "of");
    myConnectionMnager.config({io, channel});
    expect(myConnectionMnager._socketServer).toEqual(io);
    expect(myConnectionMnager._channel).toEqual(channel);
    expect(spy).toBeCalled();
    expect(spy).toBeCalledWith(`/${channel}`);
    
  });

  // test("config connection manager server > test 2", () => {
  //   const channel = channelSockets.testSocketPath;
  //   const myConnectionMnager = new ConnectionServer();
  //   myConnectionMnager.config({ io, channel });
  //   expect(myConnectionMnager._socketServer).toEqual(io);
  //   expect(myConnectionMnager._channel).toEqual(channel);
  //   expect(myConnectionMnager._nsp).toBeDefined();
  // });
  
  // test("config connection manager > test 1", async () => {
  //   const channel = channelSockets.testSocketPath;
  //   const myConnectionMnager = new ConnectionServer();
  //   myConnectionMnager.config({io, channel});
  //   const response = protocolActions.createProtocolActionResponse("event-res", ()=> {}, undefined, undefined);
  //   const protocolAction = protocolActions.createProtocolActionRequest("event", true, response);
  //   try{
  //     await connectionEvents.publishConnectionEvent(io, protocolAction , {data: "data"});

  //   } catch(err){
  //     console.error(err);
  //   }

  // });
});
