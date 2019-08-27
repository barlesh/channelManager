import "jest";
import { ResourceManager } from "../../src/resources";
import { protocolActions } from "../../../connections-manager/src/connections/protocol.actions";


describe("Demo", () => {
  test("create resource manager > test 1", () => {
    const event = "samlpe event";
    const e = data => {
      return data;
    };
    const retTrue = "sample return true event";
    const retFalse = "sample return false event";
    const protocol = [];
    const Action = protocolActions.createProtocolActionResponse(
      event,
      e,
      retTrue,
      retFalse
    );
    protocol.push(Action);
    const manager = new ResourceManager(protocol, []);
    expect(manager.getResourcesList().size).toEqual(0);
  });
});
