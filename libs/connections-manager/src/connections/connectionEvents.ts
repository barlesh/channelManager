export namespace connectionEvents {
  export function registerConnectionEvent(connection, protocolAction) {
    const event = protocolAction.event;
    const exec = protocolAction.exec;
    const retTue = protocolAction.response_truthy;
    const retFalse = protocolAction.response_falsly;

    // console.log(`registering event: ${event} with handler: ${exec} to connection: ${connection}`)
    const cb = async data => {
      let ans = false;
      try {
        ans = await exec(data);
        console.log(`*************************** ans: ${ans}`)
      } catch (err) {
        ans = false;
      }
      if (ans) {
        console.info(`execution for event: ${event} succedded.`);
        if (retTue) {
          console.info(`emmiting answer: ${retTue} `);
          connection.emit(retTue);
        }
      } else {
        console.info(`execution for event: ${event} failed.`);
        if (retFalse) {
          console.info(`emmiting answer: ${retFalse} `);
          // console.log(`connection.emit: ${connection.emit} `);
          connection.emit(retFalse);
          console.log("DONEEEEE");
        }
      }
    };
    connection.on(event, cb);
  }
}
