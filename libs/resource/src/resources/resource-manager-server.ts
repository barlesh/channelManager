import { ResourceManager } from "./resource-manager";

export class ResourceServer<T = any> extends ResourceManager {

  // the resource is not removed from the list, onlt from the agents<->resource map
  detachAgent(agentID) {
    // console.log(`detaching agent with agentID: ${agentID} from all resources`);
    const resourcesToDetach = this.getResourcesByAgent(agentID);
    resourcesToDetach.forEach(rid => {
      this.detachResourceFromAgent(agentID, rid);
    });
    // console.info(`Detached ${resourcesToDetach.length} resources.`);
  }
}
