import { protoActionRequest, protoActionResponse } from "./../../../protocol/src/actions";

export namespace connectionEvents {
  export function registerConnectionEvent(
    connection,
    protocolAction: protoActionResponse
  ) {
    const event = protocolAction.event;
    const exec = protocolAction.exec;
    const retTrue = protocolAction.response_truthy;
    const retFalse = protocolAction.response_falsly;

    const cb = async data => {
      let ans = false;
      try {
        console.info(`execute event: ${event} with data: ${data}.`);
        ans = await exec(data);
      } catch (err) {
        console.error("execution of event ", event, " caused error: ", err);
        ans = false;
      }
      if (ans) {
        console.info(`execution for event: ${event} succedded.`);
        if (retTrue) {
          console.info(`emmiting answer: ${retTrue} `);
          if (retTrue) connection.emit(retTrue);
        }
      } else {
        console.info(`execution for event: ${event} failed.`);
        if (retFalse) {
          console.info(`emmiting answer: ${retFalse} `);
          // console.log(`connection.emit: ${connection.emit} `);
          if (retFalse) connection.emit(retFalse);
        }
      }
    };
    connection.on(event, cb);
  }

  export function sendConnectionEvent(
    connection,
    protocolAction: protoActionRequest,
    data
  ) {
    if (!connection) {
      console.warn("no connection supplied. cannot send event");
    }

    const event = protocolAction.event;
    connection.emit(event, data);
  }
}
