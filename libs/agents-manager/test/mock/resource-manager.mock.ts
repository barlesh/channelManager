import { ResourceManager } from "../../../resource-manager/src/resources";
import { protocolActions } from "../../../resource-manager/src/resources/protocol.validation";

// export class MockResourceManager extends ResourceManager {

// }
const event = "samlpe event";
  const e = data => {
    return data;
  };
  const retTrue = "sample return true event";
  const retFalse = "sample return false event";
  const mockProtocol = [];
  const Action = protocolActions.createProtocolAction(
    event,
    e,
    retTrue,
    retFalse
  );
  mockProtocol.push(Action);

export const mockResourceManager = new ResourceManager(mockProtocol)