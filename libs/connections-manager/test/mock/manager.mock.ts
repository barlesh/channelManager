import { connectionID } from "./../../src/models/";

const map = new Map();
export const mockConnectionManager = {
  _connectionsList: map,
  config: (conf: any) => {},

  getConnection: cid => {
    return map.get(cid);
  },
  setConnection: (cid, connection) => {
    map.set(cid, connection);
  },

  listenToConnectionEvent: (conID, protocolAction) => {
    const connection = map.get(conID);
    const event = protocolAction.event;
    const handler = protocolAction.exec;
    connection.on(event, handler);
  },

  on: (event, handler) => {
    return;
  },

  emit: (event, data?) => {},

  subscribeToConnectionEvent: (conID, protocolAction) => {
    const conn = map.get(conID);
    conn.on(protocolAction.event, protocolAction.exec)

  },
  publishConnectionEvent: () => {}
};
