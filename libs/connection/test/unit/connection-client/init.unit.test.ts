import "jest";
import { ConnectionManager, ConnectionClient } from "../../../src/connections";
const http = require("http");
import { channelSockets } from "../../../src/models/sockets";
import { ioClientMock } from "../../mock/";
import { mockNSP } from "../../mock/nsp.mock";

let ioClient, nspClient;
const address = "http://address";
const port = 5000;

describe("Demo", () => {
  beforeAll(done => {
    nspClient = new mockNSP();
    ioClient = new ioClientMock(nspClient);
    done();
  });

  beforeEach(() => {});

  test("config connection manager > test 1", () => {
    const channel = channelSockets.testSocketPath;
    const myConnectionMnager = new ConnectionClient();
    myConnectionMnager.config({io: ioClient, channel, address, port});
    expect(myConnectionMnager._socketServer).toEqual(ioClient);
    expect(myConnectionMnager._channel).toEqual(channel);
    expect(myConnectionMnager._serverAddr).toEqual(address);
    expect(myConnectionMnager._serverPort).toEqual(port);
  });


  test("config connection manager server > test 2", async () => {
    const channel = channelSockets.testSocketPath;
    const myConnectionMnager = new ConnectionClient();
    const spy = jest.spyOn(ioClient, "connect");
    const spynsp = jest.spyOn(nspClient, "on");
    myConnectionMnager.config({ io: ioClient, channel, address, port });
    myConnectionMnager.connectToServer();
    nspClient.connected = true;
    await nspClient.generateEvent("connect");

    expect(myConnectionMnager._nsp).toBeDefined();
    
    expect(spy).toBeCalled();
    expect(spy).toBeCalledWith(`${address}:${port}/${channel}`);
    expect(spynsp).toBeCalled();

    const receivedMapLength = myConnectionMnager._connectionsList.size;
    // expect(receivedMapLength).toEqual(1);


  });

  
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
