import { protocolActions } from "../../../../connections-manager/src/connections/protocol.actions";

export let exampleActionResponse;

const event = "samlpe event";
const e = data => {
  return false;
};
const retTrue = "sample return true event";
const retFalse = "sample return false event";

exampleActionResponse = protocolActions.createProtocolActionResponse(
  event,
  e,
  retTrue,
  retFalse
);

