import { Slave } from "./../../../slave/src/slave";

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
  id: "resourceid1111",
  name: "iSID-1",
  age: 2,
  job: "ice creame maker"
}

const resource2 = {
  id: "resourceid2222",
  name: "iSID-2",
  age: 2,
  job: "ice creame eater"
}

const resource3 = {
  id: "resourceid3333",
  name: "iSID-3",
  age: 2,
  job: "ice creame licker"
}

console.info("*************************************************")
console.info("constructing slave (client) #1");
console.info("*************************************************")

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

console.info("*************************************************")
console.info("registrating new resource");
console.info("*************************************************")

usersSessionManager.registerNewResource(resource);

console.warn("client: publishing event to resource");
usersSessionManager.publishEventToResource(resource.id, "session ended");


console.info("*************************************************")
console.info("registrating new resource2");
console.info("*************************************************")

usersSessionManager.registerNewResource(resource2);

console.warn("client: publishing event to resource2");
usersSessionManager.publishEventToResource(resource2.id, "session ended", {sessionID: resource2.id});