import {
  protoActionRequest,
  protoActionResponse
} from "@resource-control/protocol";

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
      let ans;
      console.info(`execute event: ${event} with data: ${data}.`);
      ans = await runExec(event, exec, data);
      if (ans.status) {
        console.info(`execution for event: ${event} succedded.`);
        if (retTrue) {
          console.info(`emmiting answer: ${retTrue} `);
          if (retTrue) connection.emit(retTrue, ans.data);
        }
      } else {
        console.info(`execution for event: ${event} failed.`);
        if (retFalse) {
          console.info(`emmiting answer: ${retFalse} `);
          if (retFalse) connection.emit(retFalse);
        }
      }
    };
    connection.on(event, cb);
  }

  async function runExec(event: string, exec: Function, data?) {
    const res = {
      status: false,
      data: undefined
    };
    try {
      const ans = await exec(data);
      if (!ans) {
        console.log(`execution of event ${event} returned false answer.`);
        return res;
      }
      console.log(`execution of event ${event} executed successfully.`);
      res.status = true;
      res.data = ans;
    } catch (err) {
      console.log(`execution of event ${event} throwd error.`);
      console.error(err);
      return res;
    }
  }

  export async function publishConnectionEvent(
    connection,
    protocolAction: protoActionRequest,
    data
  ) {
    if (!connection) {
      console.warn("no connection supplied. cannot send event");
    }

    const expectResponse = protocolAction.expectResponse;
    if (expectResponse) {
      const res = await publishConnectionEventAndListenToResponse(
        connection,
        protocolAction,
        data
      );
      return res;
    } else {
      publishConnectionEventNoResponse(connection, data);
    }
  }

  async function publishConnectionEventNoResponse(connection, data) {
    connection.emit(event, data);
  }

  async function publishConnectionEventAndListenToResponse(
    connection,
    request: protoActionRequest,
    data
  ) {
    const response = request.response;
    const requestEvent = request.event;
    const responseEvent = response.event;
    const TIMEOUT = 50;
    const actionId = Date.now();

    return new Promise((resolve, reject) => {
      const timeoutID = setTimeout(() => {
        removeListener();
        
        return reject({
          msg: "Timeout Error, Failed to get details from the agent"
        });
      }, TIMEOUT);

      connection.emit(requestEvent, {
        id: actionId,
        data
      });
      connection.on(responseEvent, onDetailsReturned);
      function removeListener() {
        connection.removeListener(responseEvent, onDetailsReturned);

      }
      function onDetailsReturned({ id, err, data }) {

        removeListener();
        if (id == actionId) {
          clearTimeout(timeoutID);
          if (err) {
            return reject({ err, msg: "Failed to get details from the agent" });
          }
          resolve(data);
        }
      }
    });

    // let runNwait = (connection, requestEvent, data, responseEvent) => {
    //   return new Promise((resolve, reject) => {
    //     connection.emit(requestEvent.data);
    //     connection.on(responseEvent, data => {
    //       resolve(data);
    //     });
    //   });
    // };

    // console.warn("run tmlllllllllllllllllllll");
    // tml(async ()=> { return true; }, 50).then(console.log("wooooow")).catch(err=> console.error(err));
    //   tml(runNwait, 50, { rejectWith: new Error("timeout") })
    //     .then(res => {
    //       console.log(`request '${requestEvent}' recived response:  `);
    //       console.log(res);
    //       return res;
    //     })
    //     .catch(err => {
    //       // Same as above, but on timeout it will
    //       // be rejected with the provided error.
    //       console.error(
    //         `request '${requestEvent}' expected response but timeout expired.`
    //       );
    //       rejects(err);
    //     });
  }
}
