"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protocolActions;
(function (protocolActions) {
    const expectedProtocolActionResponseKeys = [
        "event",
        "exec",
        "response_truthy",
        "response_falsly"
    ];
    const expectedProtocolActionRequestKeys = [
        "event",
        "expectResponse",
        "response"
    ];
    function createProtocolActionResponse(event, exec, retTrue, retFalse) {
        try {
            const action = {
                event,
                exec,
                response_truthy: retTrue,
                response_falsly: retFalse
            };
            return action;
        }
        catch (err) {
            console.error(`failed to create protocol action for args: event: ${event}, exec: ${exec}, retTrue: ${retTrue}, retFalse: ${retFalse}`);
            console.error(err);
            return undefined;
        }
    }
    protocolActions.createProtocolActionResponse = createProtocolActionResponse;
    function createProtocolActionRequest(event, expectResponse, response) {
        try {
            const action = {
                event,
                expectResponse,
                response
            };
            return action;
        }
        catch (err) {
            console.error(`failed to create protocol action for args: event: ${event}`);
            console.error(err);
            return undefined;
        }
    }
    protocolActions.createProtocolActionRequest = createProtocolActionRequest;
    function validateProtocolActionResponse(protocol) {
        if (!(protocol instanceof Array)) {
            throw new TypeError();
        }
        if (protocol.length < 1) {
            return false;
        }
        let retVal = true;
        protocol.forEach(protocolAction => {
            if (!validateResponse(protocolAction)) {
                retVal = false;
                return;
            }
        });
        return retVal;
    }
    protocolActions.validateProtocolActionResponse = validateProtocolActionResponse;
    function validateProtocolActionRequest(protocol) {
        if (!(protocol instanceof Array)) {
            throw new TypeError();
        }
        let retVal = true;
        protocol.forEach(protocolAction => {
            if (!validateRequest(protocolAction)) {
                retVal = false;
                return;
            }
        });
        return retVal;
    }
    protocolActions.validateProtocolActionRequest = validateProtocolActionRequest;
    function validateResponse(protocolAction) {
        const keys = Object.keys(protocolAction);
        let retVal = true;
        keys.forEach(key => {
            if (!expectedProtocolActionResponseKeys.includes(key)) {
                retVal = false;
                return;
            }
        });
        if (!retVal) {
            return retVal;
        }
        if (!(typeof protocolAction["event"] === "string")) {
            return false;
        }
        if (protocolAction["response_truthy"] &&
            !(typeof protocolAction["response_truthy"] === "string")) {
            return false;
        }
        if (protocolAction["response_falsly"] &&
            !(typeof protocolAction["response_falsly"] === "string")) {
            return false;
        }
        if (!(typeof protocolAction["exec"] === "function")) {
            return false;
        }
        return true;
    }
    function validateRequest(protocolAction) {
        const keys = Object.keys(protocolAction);
        let retVal = true;
        console.log("validating requests: keys: ", keys);
        keys.forEach(key => {
            if (!expectedProtocolActionRequestKeys.includes(key)) {
                retVal = false;
                return;
            }
        });
        if (!retVal) {
            return retVal;
        }
        if (!(typeof protocolAction["event"] === "string")) {
            return false;
        }
        return true;
    }
})(protocolActions = exports.protocolActions || (exports.protocolActions = {}));
