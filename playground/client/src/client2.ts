import { Slave } from "../../../slave/src/slave";

const io = require("socket.io-client");

const socketPort = 3099;
const cname = "myspace";

const responseAction = {
  event: "test client response event",
  exec: (data?) => {
    console.log("exec was executed!!!!!!!!!!!!!!!!!!!!!!");
    return true;
  },
  response_truthy: undefined,
  response_falsly: undefined
};

const requestAction = {
  event: "session ended"
};

// const serverAddr = `http://localhost:${socketPort}/${cname}`;

// const client_socket = io.connect(serverAddr, {
//     "reconnection delay": 0,
//     "reopen delay": 0,
//     "force new connection": true
//     // transports: ["websocket"]
//   });

const masterAddr = "http://localhost";
const masterPort = socketPort;
const channel = cname;
const agentID = "1";
const slaveName = "iSID-A";
const resource = {
  id: "resourceid2222",
  name: "iSID-2",
  age: 3,
  job: "ice creame eater"
}

console.info("constructing slave (client) #2");

const usersSessionManager = new Slave(
  io,
  channel,
  masterAddr,
  masterPort,
  [requestAction],
  [responseAction],
  agentID,
  slaveName
);

usersSessionManager.registerNewResource(resource);

console.warn("client: publishing event to resource");
usersSessionManager.publishEventToResource(resource.id, "session ended");
