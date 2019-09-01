import "jest";
import { protocolActions } from "../../../connections-manager/src/connections/protocol.actions";
import { exampleActionResponse } from "../lib/";

describe("Demo", () => {
  let protocol = [];

  beforeEach(() => {
    // clone action and push it to a new rotocol array before each test
    protocol = [];
    const clonedAction = {}
    const actionKeys = Object.keys(exampleActionResponse);
    actionKeys.forEach((key)=>{
      const value = exampleActionResponse[key]
      clonedAction[key] = value;
    })
    protocol.push(clonedAction);
  });

  test("wrong exec type protocol object > test 1", () => {
    protocol[0].exec = "1"
    let ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
    protocol[0].exec = 1
    ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
    protocol[0].exec = []
    ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
    protocol[0].exec = {}
    ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong event type protocol object > test 2", () => {
    protocol[0].event = 1
    let ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
    protocol[0].event = []
    ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong response type protocol object > test 3", () => {
    protocol[0].response_truthy = 1
    let ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
    protocol[0].response_truthy = []
    ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
    protocol[0].response_truthy = {}
    ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong response type protocol object > test 4", () => {
    protocol[0].response_falsly = 1
    let ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
    protocol[0].response_falsly = []
    ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
    protocol[0].response_falsly = {}
    ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeFalsy();
  });

  test("single protocol rule > test 0", () => {
    const ans = protocolActions.validateProtocolActionResponse(protocol);
    expect(ans).toBeTruthy();
  });
});
