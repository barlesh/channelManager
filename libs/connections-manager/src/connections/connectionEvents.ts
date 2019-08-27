export namespace connectionEvents {
  export function registerConnectionEvent(connection, protocolAction) {
    const event = protocolAction.event;
    const exec = protocolAction.exec;
    const retTrue = protocolAction.response_truthy;
    const retFalse = protocolAction.response_falsly;

    console.log(`registering event: ${event} with handler: ${exec} to connection: ${connection}`)
    const cb = async data => {
      let ans = false;
      try {
        console.log("executing method: ", exec)
        ans = await exec(data);
      } catch (err) {
        ans = false;
      }
      if (ans) {
        console.info(`execution for event: ${event} succedded.`);
        if (retTrue) {
          console.info(`emmiting answer: ${retTrue} `);
          connection.emit(retTrue);
        }
      } else {
        console.info(`execution for event: ${event} failed.`);
        if (retFalse) {
          console.info(`emmiting answer: ${retFalse} `);
          // console.log(`connection.emit: ${connection.emit} `);
          connection.emit(retFalse);
        }
      }
    };
    connection.on(event, cb);
  }
}
