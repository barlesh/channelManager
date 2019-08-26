import { connectionID } from "../../../connections-manager/src/models";

export class MockConnectionManager {
  registerConnectionEvent(cid: connectionID, event: string, handler: Function) {
    return true;
  }

  on(eventType: string, func: Function){
      return true;
  }
}
