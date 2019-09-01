export interface IConnection {
    client: any;
    id: any;
    on(eve: string, handler: any): any;
    emit(eve: string, data?: any): any;
    listeners(): any;
}
