export namespace agentsUtils {
  export function agentRegistrationValidation(connection, data) {
    /*  Remote connection identified itself as an agent. 
            Extract agnet data, extract connection ID.
            Notify regarding the coupling of the connection and remote agent
        */
    const agentData = data;
    let connID;
    if (!connection) {
      console.warn("could not get connection information");
      return;
    }
    try {
      connID = connection["id"];
    } catch (err) {
      console.error(
        "this is not a connection event. can not extract connection id."
      );
      return;
    }

    //emit an event to all otrher listening modules regarding this agent registration event
    console.log(
      `Received agent registration event. agent data: ${agentData}, connection iD: ${connID}`
    );
    return {
      agentData,
      connID
    };
  }

  export function agentUnRegistrationValidation(connection, data) {
    let connID;
    try {
      connID = connection["id"];
    } catch (err) {
      console.error("this is not a socket event. can not extract socket id.");
      return;
    }

    return {
      connID
    };
  }
}
