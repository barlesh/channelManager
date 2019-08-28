import { Agent } from "./agent";
import { AgentsManager } from "./agents-manager";
import { connectionClientManagerEvents } from "./../../../connections-manager/src/connections";

export class AgentsManagerClient extends AgentsManager {
  agent;

  config(conf) {
    const connectionManager = conf["connectionManager"];
    const resourceManager = conf["resourceManager"];
    this.agent = conf["agent"];

    if (!connectionManager || !resourceManager || !this.agent) {
      console.error("not all parameres supplied.");
      throw new Error("not all parameres supplied");
    }
    this.agentsList = new Map();
    this.connectionManager = connectionManager;
    this.resourcesManager = resourceManager;

    this.connectionManager.connectToServer();

    /* 
      listen to a connection manager (client) events, regarding new succsessfull connection attampt toward the server
      Upon successfull connection, create an agent instance
    */
    this.connectionManager.on(
      connectionClientManagerEvents.connectedToRemote,
      this.createAgent
    );

    this.connectionManager.config
  }

  createAgent(connection) {
    const newAgent = new Agent(this.agent, this);
    this.add(newAgent);
  }
}
