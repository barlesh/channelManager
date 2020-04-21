export type protoActionResponse = {
  event: string;
  exec: Function;
  response_truthy: string;
  response_falsly: string;
};

export type protoActionRequest = {
  event: string;
  expectResponse: boolean;
  response: protoActionResponse;
};

export namespace protocolActions {
  const expectedProtocolActionResponseKeys = [
    "event",
    "exec",
    "response_truthy",
    "response_falsly"
  ];

  const expectedProtocolActionRequestKeys = [
    "event",
    "expectResponse",
    "response"
  ];

  export function createProtocolActionResponse(
    event: string,
    exec: Function,
    retTrue: string,
    retFalse: string
  ): protoActionResponse {
    try {
      const action: protoActionResponse = {
        event,
        exec,
        response_truthy: retTrue,
        response_falsly: retFalse
      };
      return action;
    } catch (err) {
      // console.error(
      //   `failed to create protocol action for args: event: ${event}, exec: ${exec}, retTrue: ${retTrue}, retFalse: ${retFalse}`
      // );
      // console.error(err);
      return undefined;
    }
  }

  export function createProtocolActionRequest(
    event: string,
    expectResponse: boolean,
    response: protoActionResponse
  ) {
    try {
      const action: protoActionRequest = {
        event,
        expectResponse,
        response
      };
      return action;
    } catch (err) {
      // console.error(
      //   `failed to create protocol action for args: event: ${event}`
      // );
      // console.error(err);
      return undefined;
    }
  }

  export function validateProtocolActionResponse(
    protocol: protoActionResponse[]
  ): boolean {
    if (!(protocol instanceof Array)) {
      throw new TypeError();
    }
    if (protocol.length < 1) {
      return false;
    }
    // test each protocol action
    let retVal = true;
    protocol.forEach(protocolAction => {
      if (!validateResponse(protocolAction)) {
        // // console.error(
        //   "protocol object failed because of protocol action: ",
        //   protocolAction
        // );
        retVal = false;
        return;
      }
    });
    return retVal;
  }

  export function validateProtocolActionRequest(
    protocol: protoActionRequest[]
  ): boolean {
    if (!(protocol instanceof Array)) {
      throw new TypeError();
    }

    // if (protocol.length < 1) {
    //   return false;
    // }
    // test each protocol action
    let retVal = true;
    protocol.forEach(protocolAction => {
      if (!validateRequest(protocolAction)) {
        // // console.error(
        //   "protocol object failed because of protocol action: ",
        //   protocolAction
        // );
        retVal = false;
        return;
      }
    });
    return retVal;
  }

  function validateResponse(protocolAction: any): boolean {
    const keys = Object.keys(protocolAction);
    let retVal = true;
    keys.forEach(key => {
      if (!expectedProtocolActionResponseKeys.includes(key)) {
        retVal = false;
        return;
      }
    });
    if (!retVal) {
      return retVal;
    }

    if (!(typeof protocolAction["event"] === "string")) {
      return false;
    }
    if (
      protocolAction["response_truthy"] &&
      !(typeof protocolAction["response_truthy"] === "string")
    ) {
      return false;
    }
    if (
      protocolAction["response_falsly"] &&
      !(typeof protocolAction["response_falsly"] === "string")
    ) {
      return false;
    }
    if (!(typeof protocolAction["exec"] === "function")) {
      return false;
    }

    return true;
  }

  function validateRequest(protocolAction: any): boolean {
    const keys = Object.keys(protocolAction);
    let retVal = true;
    keys.forEach(key => {
      if (!expectedProtocolActionRequestKeys.includes(key)) {
        retVal = false;
        return;
      }
    });
    if (!retVal) {
      return retVal;
    }

    if (!(typeof protocolAction["event"] === "string")) {
      return false;
    }

    return true;
  }
}
