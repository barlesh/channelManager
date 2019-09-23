const eventsMap = new Map();

export const mockConnection = {
  id: "1",
  client: {
    id: "1"
  },
  eventsMap,
  on: (event, handler) => {
    eventsMap.set(event, handler);
  },
  emit: (event, data?) => {
    return true;
  },

  removeAllListeners: (event) => {
    eventsMap.delete(event);
  },

  generateEvent: async (event, data?) => {
    const h = eventsMap.get(event);
    if (h) {
      const ans = await h(data);
    }
  },

  listeners: () => {
    return Array.from(eventsMap.keys());
  }
};
