import { protocolActions } from "../../../connections-manager/src/connections/protocol.actions";

export let exampleAction;

const event = "samlpe event";
const e = data => {
  return false;
};
const retTrue = "sample return true event";
const retFalse = "sample return false event";

exampleAction = protocolActions.createProtocolActionResponse(
  event,
  e,
  retTrue,
  retFalse
);

