import { connectionID } from "../models";

export namespace connectionEvents {
  export function registerConnectionEvent(connection, protocolAction) {
    const event = protocolAction.event;
    const exec = protocolAction.exec;
    const retTue = protocolAction.response_truthy;
    const retFalse = protocolAction.response_falsly;

    connection.on(event, async data => {
      let ans = false;
      try {
        ans = await exec(data);
      } catch (err) {
        ans = false;
      }
      if (ans) {
        console.log(`execution for event: ${event} succedded.`);
        if (retTue) {
          console.log(`emmiting answer: ${retTue} `);
          connection.emit(retTue);
        }
      } else {
        console.log(`execution for event: ${event} failed.`);
        if (retFalse) {
          console.log(`emmiting answer: ${retFalse} `);
          connection.emit(retFalse);
        }
      }
    });
  }
}
