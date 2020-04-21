export namespace connectionUtils {
  export function extractConnectionClintID(connection) {
    if (connection && connection.client && connection.client.id) {
      return connection.client.id;
    }
    // console.warn(`could not extract connection id from connection.`)
    return undefined;
  }
}
