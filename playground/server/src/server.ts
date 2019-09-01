import { Master } from "./../../../master/src/master";
import * as socketIo from "socket.io";
const http = require("http");

const socketPort = 3099;
const cname = "myspace";

const responseAction = {
  event: "session ended",
  exec: (data?) => {
    console.log(
      "exec of session ended was executed!!!!!!!!!!!!!!!!!!!!!! data: ",
      data
    );

    return true;
  },
  response_truthy: undefined,
  response_falsly: undefined
};

const requestAction = {
  event: "test server request event",
  expectResponse: false,
  response: undefined
};

const resource1 = {
  id: "resourceid1111",
  name: "iSID-1",
  age: 2,
  job: "ice creame maker"
};

const resource2 = {
  id: "resourceid2222",
  name: "iSID-2",
  age: 2,
  job: "ice creame eater"
};

const httpServer = http.createServer().listen(socketPort);
const serverIO = socketIo(httpServer);

const userSessionManager = new Master(
  serverIO,
  cname,
  [requestAction],
  [responseAction]
);
userSessionManager.addResource(resource1, resource1.id);
userSessionManager.addResource(resource2, resource2.id);
