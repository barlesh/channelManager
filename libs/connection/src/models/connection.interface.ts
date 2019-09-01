export interface IConnection {
  client: any;
  id;
  on(eve: string, handler: any);
  emit(eve: string, data?: any);
  listeners();
}
