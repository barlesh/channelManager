import { mockConnection } from "./connection.mock";

const eventsMap = new Map();

export const mockNSP = {
  eventsMap,
  on: (event, handler) => {
    eventsMap.set(event, handler);
  },
  emit: (event, data?) => {
    return true;
  },

  generateEvent: async event => {
    const h = eventsMap.get(event);
    if (h) {
      const ans = await h(mockConnection);
    }
  },

  listeners: () => {
    return Array.from(eventsMap.keys());
  }
};
