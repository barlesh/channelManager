import { ResourceManager } from "../../../resource-manager/src/resources";
import { protocolActions } from "./../../../connections-manager/src/connections/protocol.actions";
const event = "samlpe event";
const e = data => {
  return data;
};
const retTrue = "sample return true event";
const retFalse = "sample return false event";
const mockProtocolResponse = [];
const ActionResponse = protocolActions.createProtocolActionResponse(
  event,
  e,
  retTrue,
  retFalse
);
mockProtocolResponse.push(ActionResponse);

const mockProtocolRequest = [];
const ActionRequest = protocolActions.createProtocolActionRequest(
  event,
);
mockProtocolRequest.push(ActionRequest);

export const mockResourceManager = new ResourceManager(mockProtocolResponse, mockProtocolRequest);
