import { IChannelConnection } from "./../models";
import { ChannelEvent } from "./channelEvents";

type channelConnectionArgs = {
  ns: string;
};

export class ConnectionManager implements IChannelConnection {
  channels = {};
  io;

  init(io) {
    // console.log("init connection manager!");
    if (!io) {
      throw Error("io not supplied");
    }
    this.io = io;
  }

  terminate() {
    // console.log("terminating channel connection manager");
    if (!this.io) {
      console.error("io was not initiated. cannot terminate");
      throw Error("internal error");
    }
    this.io.close();
    delete this.io;
    this.io = undefined;
  }

  initChannel(nsp: string) {
    if (!nsp) {
      console.error("DId not receive channel name. Aborting.");
      throw new Error("wrong channel name");
    }

    try {
      this.io.of(nsp);
      this.channels[nsp] = nsp;
    } catch (err) {
      console.error(err);
      throw new Error("failed to create nsp for channel");
    }
  }

  destroyChannel(nsp: string) {}

  registerEventHandler(ce: ChannelEvent) {
    // if (!this._nsp) {
    //   console.error("nsp was not initiated. cannot register event");
    //   throw Error("internal error");
    // }
    // if (!ce.name || !ce.cb) {
    //   console.error("Cannot register event: ", ce, " to nsp: ", this.ns);
    //   throw Error("wrong event type");
    // }
  }
}
