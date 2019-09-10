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
      let retData = {
        id: undefined,
        err: undefined,
        data: undefined
      };
      console.info(`execute event: ${event}.`);
      console.info("data: ", data);
      ans = await runExec(event, exec, data);
      if (ans.status) {
        console.info(`execution for event: ${event} succedded.`);
        if (retTrue) {
          console.info(`emmiting answer: ${retTrue} `);
          retData.id = ans.actionID;
          retData.data = ans.data;
          connection.emit(retTrue, retData);
        }
      } else {
        console.info(`execution for event: ${event} failed.`);
        if (retFalse) {
          console.info(`emmiting answer: ${retFalse} `);
          retData.id = ans.actionID;
          retData.err = ans.err;
          connection.emit(retFalse, retData);
        }
      }
    };

    registerEventNoDup(connection, event, cb);
  }

  async function runExec(event: string, exec: Function, receivedData?) {
    const res = {
      status: false,
      data: undefined,
      err: undefined,
      actionID: undefined
    };
    try {
      const { actionID, data } = receivedData;
      res.actionID = actionID;
      const ans = await exec(data);
      if (!ans) {
        console.log(`execution of event ${event} returned false answer.`);
        return res;
      }
      console.log(`execution of event ${event} executed successfully.`);
      res.status = true;
      res.data = ans;
      return res;
    } catch (err) {
      console.log(`execution of event ${event} throwd error.`);
      console.error(err);
      res.err = err;
      return res;
    }
  }

  export async function publishConnectionEvent(
    connection,
    protocolAction: protoActionRequest,
    data
  ): Promise<any> {
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
      publishConnectionEventNoResponse(connection, protocolAction, data);
    }
  }

  async function publishConnectionEventNoResponse(
    connection,
    protocolAction: protoActionRequest,
    data
  ) {
    const sentData = {
      actionID: undefined,
      data
    };
    connection.emit(protocolAction.event, sentData);
  }

  async function publishConnectionEventAndListenToResponse(
    connection,
    request: protoActionRequest,
    data
  ) {
    const response = request.response;
    const requestEvent = request.event;
    const responseEvent = response.event;
    const TIMEOUT = 1000;
    const actionID = Date.now();

    return new Promise((resolve, reject) => {
      const timeoutID = setTimeout(() => {
        removeListener();

        return reject({
          msg: "Timeout Error, Failed to get details from the agent"
        });
      }, TIMEOUT);

      const sentData = {
        actionID,
        data
      };
      connection.emit(requestEvent, sentData);
      registerEventNoDup(connection, responseEvent, onDetailsReturned);

      function removeListener() {
        connection.removeListener(responseEvent, onDetailsReturned);
      }

      function onDetailsReturned({ id, err, data }) {
        removeListener();
        if (id == actionID) {
          clearTimeout(timeoutID);
          if (err) {
            return reject({ err, msg: "Failed to get details from the agent" });
          }
          resolve(data);
        }
      }
    });
  }

  export function registerEventNoDup(connection, event: string, cb: Function) {
    unregisterEvent(connection, event);
    registerEvent(connection, event, cb);
  }

  function registerEvent(connection, event: string, cb: Function) {
    connection.on(event, cb);
  }

  function unregisterEvent(connection, event: string) {
    connection.removeAllListeners(event);
  }
}
