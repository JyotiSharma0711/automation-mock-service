/**
 * Update Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load order_id and update_target from session data
 */

export async function updateDefaultGenerator(existingPayload: any, sessionData: any) {
  // Update context timestamp
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  
  // Update message_id from session data
  if (sessionData.message_id && existingPayload.context) {
    existingPayload.context.message_id = sessionData.message_id;
  }
  
  // Load order_id from session data
  if (sessionData.order_id && existingPayload.message) {
    existingPayload.message.order_id = sessionData.order_id;
  }
  
  // Load update_target from session data
  if (sessionData.update_target && existingPayload.message) {
    existingPayload.message.update_target = sessionData.update_target;
  }
  
  return existingPayload;
} 