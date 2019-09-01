import "jest";
import { ResourceManager } from "../../src/resources";

import * as uid from "uuid";
import { protocolActions } from "../../../connections-manager/src/connections/protocol.actions";


describe("Demo", () => {
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
  let manager;

  beforeEach(() => {
    manager = new ResourceManager(protocol, []);
  });

  test("add resource > test 1", () => {
    const resource = {
      name: "rname"
    };
    // generate unique ID
    const uidS: string = uid();
    manager.add(resource, uidS);
    expect(manager.getResourcesList().size).toEqual(1);

    const receivedResource = manager.get(uidS);
    expect(receivedResource).toEqual(resource);
  });

  test("remove resource > test 1", () => {
    const resource = {
      name: "rname"
    };
    const uidS: string = uid();
    manager.add(resource, uidS);
    expect(manager.getResourcesList().size).toEqual(1);
    manager.remove(uidS);
    expect(manager.getResourcesList().size).toEqual(0);
  });
});
