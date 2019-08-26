export namespace connectionUtils {
  export function extractConnectionID(connection) {
    if (connection && connection.client && connection.client.id) {
      return connection.client.id;
    }
    return undefined;
  }
}
