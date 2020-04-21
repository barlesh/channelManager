import { connectionServerManagerEvents } from "@resource-control/connection";
import { agentsProtocolEvents } from "@resource-control/connection";
import { AgentsManager } from "./agents-manager";
import {
  protocolActions,
  protoActionResponse
} from "@resource-control/protocol";

export class AgentsManagerServer extends AgentsManager {
  /* Server Class configuration */
  config(conf) {
    if (!conf) {
      // console.error(
      //   "no configuration object supplied. cannot configure agent manager server"
      // );
      throw new Error("can not configure agent manager server");
    }
    // console.debug("configuring agent manager server. configuration: ", conf);
    const connectionManager = conf["connectionManager"];
    if (!connectionManager) {
      // console.error("not all parameres supplied.");
      throw new Error("not all parameres supplied");
    }
    this.agentsList = new Map();

    // TODO - the connection manager should be already configured and listen to incoming connections
    // need to add a query regarind its listen state. if not, then make it start listening
    this.connectionManager = connectionManager;

    /* 
      listen to a connection manager (server) events, regarding new connection
      This will register a new listener to the connection, expecting for the remote conncetion to send "agent registration" event
    */
    this.connectionManager.on(
      connectionServerManagerEvents.remoteConnected,
      this.registerToAgentRegistrationEvents.bind(this)
    );
  }

  registerToAgentRegistrationEvents(connectionID) {
    if (!connectionID) {
      // console.warn(
      //   "cannot regiaster to agent registration event without remote connection. abort"
      // );
      return;
    }

    /* 
      register events to the remote connection.
      The interesting events are agent registration (agentsProtocolEvents.agentRegister) and agent un registration.
      Bind the connectionID to the event handler, so the registered agent will have access to the connection object
    */
    let Action: protoActionResponse;
    const f = this.agentRegistration;
    const bindedagentRegistration = this.agentRegistration.bind(
      this,
      connectionID
    );
    Action = protocolActions.createProtocolActionResponse(
      agentsProtocolEvents.agentRegister,
      bindedagentRegistration,
      undefined,
      undefined
    );
    this.connectionManager.subscribeToConnectionEvent(connectionID, Action);

    const bindedagentUnRegistration = this.agentUnRegistration.bind(
      this,
      connectionID
    );
    Action = protocolActions.createProtocolActionResponse(
      agentsProtocolEvents.agentUnRegister,
      bindedagentUnRegistration,
      undefined,
      undefined
    );
    this.connectionManager.subscribeToConnectionEvent(connectionID, Action);
  }
}
