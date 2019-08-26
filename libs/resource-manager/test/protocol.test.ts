import "jest";
import { protocolActions } from "./../../connections-manager/src/connections/protocol.actions";

describe("Demo", () => {
  let protocol = [];

  beforeEach(() => {
    protocol = [];
  });

  test("wrong exec type protocol object > test 1", () => {
    const proto_action = {
      event: "test event",
      exec: "exec",
      response_truthy: "res true",
      response_falsly: "res false"
    };
    protocol.push(proto_action);
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong even type protocol object > test 2", () => {
    const proto_action = {
      event: 1,
      exec: () => {
        return true;
      },
      response_truthy: "res true",
      response_falsly: "res false"
    };
    protocol.push(proto_action);
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong response type protocol object > test 3", () => {
    const proto_action = {
      event: "test event",
      exec: () => {
        return true;
      },
      response_truthy: 1,
      response_falsly: "res false"
    };
    protocol.push(proto_action);
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong response type protocol object > test 4", () => {
    const proto_action = {
      event: "test event",
      exec: () => {
        return true;
      },
      response_truthy: "res true",
      response_falsly: 1
    };
    protocol.push(proto_action);
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("single protocol rule > test 2", () => {
    const proto_action = {
      event: "test event",
      exec: () => {
        return true;
      },
      response_truthy: "res true",
      response_falsly: "res false"
    };
    protocol.push(proto_action);
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeTruthy();
  });
});
