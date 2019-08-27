const eventsMap = new Map();

export const mockConnection = {
  id: "1",
  client: "1234",
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
      const ans = await h();
    }
  },

  listeners: () => {
    return Array.from(eventsMap.keys());
  }
};
