import { AgentsManager, AgentsManagerEvents } from "./agents-manager";
import { connectionClientManagerEvents } from "@resource-control/connection";
import { agentsProtocolEvents } from "@resource-control/connection";
import { connectionID } from "@resource-control/connection";

export class AgentsManagerClient extends AgentsManager {
  agent;

  /* Client Class configuration */
  config(conf) {
    const connectionManager = conf["connectionManager"];
    this.agent = conf["agent"];

    if (!connectionManager || !this.agent) {
      console.error("not all parameres supplied.");
      throw new Error("not all parameres supplied");
    }
    this.agentsList = new Map();
    this.connectionManager = connectionManager;

    /* 
    listen to a connection manager (client) events, regarding new succsessfull connection attampt toward the server
    Upon successfull connection, create an agent instance
    */
    this.connectionManager.on(
      connectionClientManagerEvents.connectedToRemote,
      this.createAgentClient.bind(this, this.agent)
    );
    this.connectionManager.on(
      connectionClientManagerEvents.disconnectedFromRemote,
      this.agentDisconnection.bind(this, this.agent["id"])
    );

    this.connectionManager.on(
      connectionClientManagerEvents.remoteDisconnected,
      this.agentDisconnection.bind(this, this.agent["id"])
    );
    this.connectionManager.connectToServer();
  }

  createAgentClient(agentData, connectionID: connectionID) {
    // create agent localy
    const agentID = this.createAgent(agentData, connectionID);
    // publish to relaying modules
    const Action = {
      event: agentsProtocolEvents.agentRegister,
      expectResponse: false,
      response: undefined
    };
    this.publishEvent(connectionID, Action, this.agent);
    this.emit(AgentsManagerEvents.agentRegistered, agentID);
  }
}
