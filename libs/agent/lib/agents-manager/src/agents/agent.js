"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uid = require("uuid");
class Agent {
    constructor(agentObj, agentManager) {
        try {
            const received_id = agentObj["id"];
            this._id = received_id ? received_id : uid();
        }
        catch (err) {
            console.error(`did not received a propare agent object: ${agentObj}. error: `, err);
            return;
        }
        const connectionID = agentObj["connectionID"];
        if (!connectionID) {
            console.error("agent object does not hold connection ID. We will not be able to connect with it. cannot create agent.");
            throw new Error("connection id missing.");
        }
        this._connectionID = connectionID;
        this._manager = agentManager;
    }
    registerProtocolEvent(protocolAction) {
        this._manager.registerConnectionEvent(this._connectionID, protocolAction);
    }
    unregisterProtocolEvent(protocolAction) {
        console.warn(`need to un register action ${protocolAction} from agent ${this}, Currently not supported`);
    }
    publishEvent(protocolAction, data) {
        this._manager.publishEvent(this._connectionID, protocolAction, data);
    }
    getID() {
        return this._id;
    }
}
exports.Agent = Agent;
