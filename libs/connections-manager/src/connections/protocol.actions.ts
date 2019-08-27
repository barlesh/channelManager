export type protoActionResponse = {
  event: string;
  exec: Function;
  response_truthy: string;
  response_falsly: string;
};

export type protoActionRequest = {
  event: string;
}

export namespace protocolActions {
  const expectedProtocolActionKeys = [
    "event",
    "exec",
    "response_truthy",
    "response_falsly"
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
      console.error(
        `failed to create protocol action for args: event: ${event}, exec: ${exec}, retTrue: ${retTrue}, retFalse: ${retFalse}`
      );
      console.error(err);
      return undefined;
    }
  }

  export function validate_protocol_obj(protocol: protoActionResponse[]): boolean {
    if (!(protocol instanceof Array)) {
      throw new TypeError();
    }
    if (protocol.length < 1) {
      return false;
    }
    // test each protocol action
    let retVal = true;
    protocol.forEach(protocolAction => {
      if (!validate_protocol_action(protocolAction)) {
        // console.error(
        //   "protocol object failed because of protocol action: ",
        //   protocolAction
        // );
        retVal = false;
        return;
      }
    });
    return retVal;
  }

  function validate_protocol_action(protocolAction: any): boolean {
    const keys = Object.keys(protocolAction);
    // console.log("kyes: ", keys);
    let retVal = true;
    keys.forEach(key => {
      // console.log(`is key: ${key} include in array?`)
      if (!expectedProtocolActionKeys.includes(key)) {
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
    if (!(typeof protocolAction["response_truthy"] === "string")) {
      return false;
    }
    if (!(typeof protocolAction["response_falsly"] === "string")) {
      return false;
    }
    if (!(typeof protocolAction["exec"] === "function")) {
      return false;
    }

    return true;
  }
}
