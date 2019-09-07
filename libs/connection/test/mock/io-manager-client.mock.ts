import { mockNSP } from "./nsp.mock";

export class ioClientMock {
  listenersMap = new Map();
  nsp;
  constructor(nsp: mockNSP) {
    this.nsp = nsp;
  }
  connect(path: string) {
    return this.nsp;
  }
  on(event, handler) {
    this.listenersMap.set(event, handler);
  }

  async generateEvent(event) {
    const h = this.listenersMap.get(event);
    await h();
  }
}
