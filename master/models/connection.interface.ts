import { ChannelEvent } from "../src/channelEvents";

export interface IChannelConnection {
  io;
  channels: Object;
  init(io);
  terminate();
  initChannel(nsp: string);
  destroyChannel(nsp: string);
  registerEventHandler(ce: ChannelEvent);
}
