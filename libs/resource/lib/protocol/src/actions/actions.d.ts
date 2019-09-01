export declare type protoActionResponse = {
    event: string;
    exec: Function;
    response_truthy: string;
    response_falsly: string;
};
export declare type protoActionRequest = {
    event: string;
    expectResponse: boolean;
    response: protoActionResponse;
};
export declare namespace protocolActions {
    function createProtocolActionResponse(event: string, exec: Function, retTrue: string, retFalse: string): protoActionResponse;
    function createProtocolActionRequest(event: string, expectResponse: boolean, response: protoActionResponse): protoActionRequest;
    function validateProtocolActionResponse(protocol: protoActionResponse[]): boolean;
    function validateProtocolActionRequest(protocol: protoActionRequest[]): boolean;
}
