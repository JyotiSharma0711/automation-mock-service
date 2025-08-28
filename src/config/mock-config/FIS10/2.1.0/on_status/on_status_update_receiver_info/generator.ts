/**
 * Status Generator for FIS10
 * 
 * Logic:
 * 1. Update context with current timestamp
 * 2. Update transaction_id and message_id from session data
 * 3. Load quote data from session data
 */

export async function onStatusUpdateReceiverInfoDefaultGenerator(existingPayload: any, sessionData: any) {
    // Update context timestamp
    if (existingPayload.context) {
      existingPayload.context.timestamp = new Date().toISOString();
    }
    
    console.log("existingPayload on status update receiver info", existingPayload);
    console.log("sessionData for on_status_update_receiver_info", sessionData);
    // Update transaction_id from session data
    if (sessionData.transaction_id && existingPayload.context) {
      existingPayload.context.transaction_id = sessionData.transaction_id;
    }
    
    // Update message_id from session data
    if (sessionData.message_id && existingPayload.context) {
      existingPayload.context.message_id = sessionData.message_id;
    }
    
    // Update BAP/BPP URIs from session data
    // if (sessionData.bap_id && existingPayload.context) {
    //   existingPayload.context.bap_id = sessionData.bap_id;
    //   console.log("Updated bap_id from session:", sessionData.bap_id);
    // }
    // if (sessionData.bap_uri && existingPayload.context) {
    //   existingPayload.context.bap_uri = sessionData.bap_uri;
    //   console.log("Updated bap_uri from session:", sessionData.bap_uri);
    // }
    // if (sessionData.bpp_id && existingPayload.context) {
    //   existingPayload.context.bpp_id = sessionData.bpp_id;
    //   console.log("Updated bpp_id from session:", sessionData.bpp_id);
    // }
    // if (sessionData.bpp_uri && existingPayload.context) {
    //   existingPayload.context.bpp_uri = sessionData.bpp_uri;
    //   console.log("Updated bpp_uri from session:", sessionData.bpp_uri);
    // }
    
    // Load quote from session data
    if (sessionData.quote && existingPayload.message) {
      existingPayload.message.quote = sessionData.quote;
    }
    
    return existingPayload;
  } 