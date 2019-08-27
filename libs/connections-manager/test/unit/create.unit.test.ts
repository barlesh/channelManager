import "jest";
import { ConnectionServer } from "../../src/connections/connections-server";


describe("Demo", () => {

  beforeEach(() => {
  });

  test("create connection manager > test 1", () => {
    const connectionMnager = new ConnectionServer();
    expect(connectionMnager._nsp).not.toBeDefined();
  });

});
