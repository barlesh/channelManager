import { mockConnection } from "./connection.mock";

export const ioMock = {
  of: (name: string) => {
    return mockConnection;
  }
};
