import { Protobuf } from '@meshtastic/js';
import { logDebug, logWarn } from '../utils/logger.js';
import { getDeviceCacheEntry } from '../utils/cache.js';

/**
 * Handles incoming MapReport messages
 * @param dataMessage
 * @param packet
 * @param identifier
 */
export function handleMapReportMessage(
  dataMessage: Protobuf.Mesh.Data,
  packet: Protobuf.Mesh.MeshPacket,
  identifier: string
) {
  try {
    const mapReport = Protobuf.Mesh.MapReport.fromBinary(dataMessage.payload);

    // Update the cache
    const deviceEntry = getDeviceCacheEntry(identifier);
    deviceEntry.lastWaypoint = mapReport;
    deviceEntry.lastUpdateTime = Date.now();

    logDebug('MAP_REPORT_APP', {
      id: packet.id,
      from: identifier,
      to: packet.to.toString(16),
      data: mapReport.toJSON(),
    });
  } catch (error) {
    logWarn('Failed to parse MapReport message:', error);
  }
}
