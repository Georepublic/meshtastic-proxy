import { Protobuf } from '@meshtastic/js';
import { logDebug, logWarn } from '../utils/logger.js';
import { getDeviceCacheEntry } from '../utils/cache.js';

/**
 * Handles incoming NodeInfo messages
 * @param dataMessage
 * @param packet
 * @param identifier
 */
export function handleNodeInfoMessage(
  dataMessage: Protobuf.Mesh.Data,
  packet: Protobuf.Mesh.MeshPacket,
  identifier: string
) {
  try {
    const nodeInfo = Protobuf.Mesh.User.fromBinary(dataMessage.payload);

    // Update the cache
    const deviceEntry = getDeviceCacheEntry(identifier);
    deviceEntry.lastNodeInfo = nodeInfo;

    logDebug('NODEINFO_APP', {
      id: packet.id,
      from: identifier,
      to: packet.to.toString(16),
      data: nodeInfo.toJSON(),
    });
  } catch (error) {
    logWarn('Failed to parse NodeInfo message:', error);
  }
}
