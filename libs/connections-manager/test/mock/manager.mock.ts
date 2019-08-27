import { connectionID } from "./../../src/models/";

const map = new Map();
export const mockConnectionManager = {
  _connectionsList: map,
  config: (io, name) => {},

  getConnection: cid => {
    return map.get(cid);
  },

  registerConnectionEvent: (conID, protocolAction) => {
    const connection = map.get(conID);
    const event = protocolAction.event;
    const handler = protocolAction.exec;
    connection.on(event, handler);
  },

  on: (event, handler) => {
    return;
  },

  emit: (event, data?) => {},

  setConnection: (cid, connection) => {
      map.set(cid, connection);
  }
};
