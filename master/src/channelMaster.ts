import { ChannelEvent } from "./channelEvents";
import { ConnectionManager } from "./channelConnections";

type channelArgs = {
  ns: string;
  events: Array<ChannelEvent>;
};

export class ChannelMaster /* implemet IChannelUser */ {
  _connectionMnager;
  constructor(args: channelArgs) {
    console.log(" [[ Channel master ]] constructor. args: ", args);
    // this._connectionMnager = new ConnectionManager({ ns: args.ns });
    // this._connectionMnager.init();
  }
}
