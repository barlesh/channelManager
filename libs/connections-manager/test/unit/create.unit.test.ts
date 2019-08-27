import "jest";
import { ConnectionManager } from "../../src/connections";


describe("Demo", () => {

  beforeEach(() => {
  });

  test("create connection manager > test 1", () => {
    const connectionMnager = new ConnectionManager();
    expect(connectionMnager._nsp).not.toBeDefined();
  });

});
