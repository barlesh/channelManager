import { protoActionRequest, protoActionResponse } from "./../../../protocol/src/actions";
export declare namespace connectionEvents {
    function registerConnectionEvent(connection: any, protocolAction: protoActionResponse): void;
    function publishConnectionEvent(connection: any, protocolAction: protoActionRequest, data: any): Promise<unknown>;
}
