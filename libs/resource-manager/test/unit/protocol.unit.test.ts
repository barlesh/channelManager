import "jest";
import { protocolActions } from "../../../connections-manager/src/connections/protocol.actions";
import { exampleProtocol } from "../lib/protocol.lib";

describe("Demo", () => {
  let protocol = [];

  beforeEach(() => {
    protocol = exampleProtocol;
  });

  test("wrong exec type protocol object > test 1", () => {
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong even type protocol object > test 2", () => {
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong response type protocol object > test 3", () => {
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("wrong response type protocol object > test 4", () => {
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeFalsy();
  });

  test("single protocol rule > test 2", () => {
    const ans = protocolActions.validate_protocol_obj(protocol);
    expect(ans).toBeTruthy();
  });
});
