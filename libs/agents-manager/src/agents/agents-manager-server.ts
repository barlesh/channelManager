import {
  connectionServerManagerEvents
} from "../../../connections-manager/src/connections";
import { AgentsManager } from "./agents-manager";

export class AgentsManagerServer extends AgentsManager {
  config(conf) {
    const connectionManager = conf["connectionManager"];
    const resourceManager = conf["resourceManager"];
    if (!connectionManager || !resourceManager) {
      console.error("not all parameres supplied.");
      throw new Error("not all parameres supplied");
    }
    this.agentsList = new Map();

    // TODO - the connection manager should be already configured and listen to incoming connections
    // need to add a query regarind its listen state. if not, then make it start listening
    this.connectionManager = connectionManager;
    this.resourcesManager = resourceManager;

    /* 
      listen to a connection manager (server) events, regarding new connection
      This will register a new listener to the connection, expecting for the remote conncetion to send "agent registration" event
    */
    this.connectionManager.on(
      connectionServerManagerEvents.remoteConnected,
      this.registerToAgentRegistrationEvents.bind(this)
    );
  }
}
