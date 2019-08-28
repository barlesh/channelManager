import { protocolActions } from "../../../../libs/connections-manager/src/connections/protocol.actions";


const Events = {
    simple: "simlpe event"
}

const Execs = {
    simple: data => {
        return data;
    }
}

const Responses = {
    simple_true: "simple return true event",
    simple_false: "simple return false event"
}

const Action1 = protocolActions.createProtocolAction(
    Events.simple,
    Execs.simple,
    Responses.simple_true,
    Responses.simple_false,
  );

export const protocolActionsList_simple = [
    Action1
]