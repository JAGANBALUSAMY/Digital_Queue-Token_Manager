const db = require('../config/database');

// Generic function to handle database queries with error handling
const query = async (text, params) => {
  try {
    const result = await db.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Function to generate unique token number
const generateTokenNumber = async (queueId) => {
  try {
    // Get the count of tokens generated today for this queue
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const countQuery = `
      SELECT COUNT(*) as count 
      FROM tokens 
      WHERE queue_id = $1 
      AND created_at >= $2 
      AND created_at < $3
    `;
    
    const result = await db.query(countQuery, [queueId, startOfDay, endOfDay]);
    const count = parseInt(result.rows[0].count) + 1;
    
    // Format as TKN + 3-digit number (e.g., TKN001, TKN002, etc.)
    const tokenNumber = `TKN${count.toString().padStart(3, '0')}`;
    
    return tokenNumber;
  } catch (error) {
    console.error('Error generating token number:', error);
    throw error;
  }
};

// Function to get the next token position in queue
const getNextTokenPosition = async (queueId) => {
  try {
    // Get the current highest position in the queue for tokens that are still waiting
    const positionQuery = `
      SELECT MAX(token_position) as max_position 
      FROM tokens 
      WHERE queue_id = $1 
      AND status = 'waiting'
    `;
    
    const result = await db.query(positionQuery, [queueId]);
    const maxPosition = result.rows[0].max_position;
    
    // If there are no waiting tokens, start from 1, otherwise add 1 to the max position
    return maxPosition ? maxPosition + 1 : 1;
  } catch (error) {
    console.error('Error getting next token position:', error);
    throw error;
  }
};

module.exports = {
  query,
  generateTokenNumber,
  getNextTokenPosition
};