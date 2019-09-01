import { mockConnection } from "./connection.mock";
import { mockNSP } from "./nsp.mock";

const listenersMap = new Map();

export const ioMock = {
  of: (name: string) => {
    return mockNSP;
  },
  on : (event, handler) => {
    listenersMap.set(event, handler);
  },

  generateEvent: async (event) => {
    const h = listenersMap.get(event);
    await h();
  }
};
