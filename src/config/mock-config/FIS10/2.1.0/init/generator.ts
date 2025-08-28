/**
 * Init Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp and correct action
 * 2. Update transaction_id and message_id from session data
 * 3. Load items, fulfillments, and provider from session data
 * 4. Update billing and tags from session data
 */

export async function initDefaultGenerator(existingPayload: any, sessionData: any) {
  // Update context timestamp and action
  if (existingPayload.context) {
    existingPayload.context.timestamp = new Date().toISOString();
    existingPayload.context.action = "init";
  }
  
  // Update transaction_id from session data
  if (sessionData.transaction_id && existingPayload.context) {
    existingPayload.context.transaction_id = sessionData.transaction_id;
  }
  // Load items from session
  if (sessionData.selected_items && existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.items = sessionData.selected_items;
  }
  
  // Load fulfillments from session
  if (sessionData.selected_fulfillments && existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
  }
  
  // Load provider from session
  if (sessionData.selected_provider && existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.provider = sessionData.selected_provider;
  }
  
  // Load billing from session
  if (sessionData.billing && existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.billing = sessionData.billing;
  }
  
  // Load tags from session (BAP_TERMS and BPP_TERMS)
  if (sessionData.tags && existingPayload.message && existingPayload.message.order) {
    existingPayload.message.order.tags = sessionData.tags;
  }
  
  return existingPayload;
}
