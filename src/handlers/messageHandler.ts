import { Protobuf } from '@meshtastic/js';
import { decryptPayload } from './decryptionHandler.js';
import { parseDataMessage } from './parsingHandler.js';
import { logInfo, logWarn } from '../utils/logger.js';

/**
 * Handles incoming messages from the MQTT broker
 * @param topic
 * @param payload
 */
export async function handleMessage(topic: string, payload: Buffer): Promise<void> {

  // In case this is a ServiceEnvelope message
  try {
    const serviceEnvelope = Protobuf.Mqtt.ServiceEnvelope.fromBinary(payload);

    // In case this is a MeshPacket message inside the ServiceEnvelope
    if (serviceEnvelope.packet) {
      const packet = serviceEnvelope.packet;
      const { case: variantCase } = packet.payloadVariant;

      if (variantCase === 'encrypted') {
        // Attempt to decrypt the packet if it is encrypted
        try {
          const decryptedPayload = decryptPayload(packet);
          const dataMessage = Protobuf.Mesh.Data.fromBinary(decryptedPayload);
          await parseDataMessage(dataMessage, packet, serviceEnvelope);
        } catch (error) {
          logWarn('Failed to decrypt packet:', error);
        }
      } else if (variantCase === 'decrypted') {
        // Handle decrypted packets if necessary
      }
    }
  } catch (error) {
    // Handle parsing errors if necessary
    logWarn('Failed to parse ServiceEnvelope:', error);
  }
}
