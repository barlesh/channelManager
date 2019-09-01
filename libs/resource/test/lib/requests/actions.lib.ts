import { protocolActions } from "../../../../connections-manager/src/connections/protocol.actions";

export let exampleActionRequest;

const event = "samlpe event";

exampleActionRequest = protocolActions.createProtocolActionRequest(
  event
);

