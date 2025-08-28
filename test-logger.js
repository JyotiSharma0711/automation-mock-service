// Test script to verify logger handles circular references
const { logInfo, logError, logDebug } = require('./dist/utils/logger');

// Create a circular reference
const obj1 = { name: 'test1' };
const obj2 = { name: 'test2', ref: obj1 };
obj1.ref = obj2; // This creates a circular reference

console.log('Testing logger with circular reference...');

try {
    logInfo({
        message: 'Test message with circular reference',
        transaction_id: 'test-123',
        meta: {
            circularObj: obj1,
            simpleData: 'test data'
        }
    });
    
    console.log('✅ Logger handled circular reference successfully');
} catch (error) {
    console.error('❌ Logger failed to handle circular reference:', error.message);
}

console.log('Test completed'); 