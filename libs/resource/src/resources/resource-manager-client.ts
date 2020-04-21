import { ResourceManager } from "./resource-manager";

export class ResourceClient<T = any> extends ResourceManager {

  // the resource is removed from the list, and from the agents<->resource map
  detachAgent(agentID) {
    // console.log(`detaching agent with agentID: ${agentID} from all resources`);
    const resourcesToDetach = this.getResourcesByAgent(agentID);
    resourcesToDetach.forEach(rid => {
      this.detachResourceFromAgent(agentID, rid);
      this.remove(rid);
    });
    // console.info(`Detached ${resourcesToDetach.length} resources.`);
  }
}
