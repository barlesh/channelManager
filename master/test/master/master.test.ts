import "jest";

import { ChannelMaster } from "../../src/channelMaster";
import { channelNamespaces } from "../models/namespaces";
import { channelEvents } from "../models/events";

describe("Demo", () => {
  beforeEach(() => {});

  test("init master > test 1", () => {
    const eventsObj = {
      [channelEvents.testEventName]: channelEvents.testEventCallBack
    };
    const eventList = [];
    eventList.push(eventsObj);

    const initObj = {
      ns: channelNamespaces.testNS,
      events: eventList
    };

    const master = new ChannelMaster(initObj);
    expect(1).toBe(1);
  });
});
