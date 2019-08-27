import "jest";
import { protocolActions } from "../../../connections-manager/src/connections/protocol.actions";
import { exampleProtocol } from "../lib/protocol.lib";
import { exampleAction } from "../lib/actions.lib";

describe("Demo", () => {
  let protocol = [];

  beforeEach(() => {
    // clone action and push it to a new rotocol array before each test
    protocol = [];
    const clonedAction = {}
    const actionKeys = Object.keys(exampleAction);
    actionKeys.forEach((key)=>{
      const value = exampleAction[key]
      clonedAction[key] = value;
    })
    protocol.push(clonedAction);
  });

  test("wrong exec type protocol object > test 1", () => {
    protocol[0].exec = "1"
    let ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
    protocol[0].exec = 1
    ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
    protocol[0].exec = []
    ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
    protocol[0].exec = {}
    ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong event type protocol object > test 2", () => {
    protocol[0].event = 1
    let ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
    protocol[0].event = []
    ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong response type protocol object > test 3", () => {
    protocol[0].response_truthy = 1
    let ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
    protocol[0].response_truthy = []
    ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
    protocol[0].response_truthy = {}
    ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong response type protocol object > test 4", () => {
    protocol[0].response_falsly = 1
    let ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
    protocol[0].response_falsly = []
    ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
    protocol[0].response_falsly = {}
    ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("single protocol rule > test 0", () => {
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeTruthy();
  });
});
