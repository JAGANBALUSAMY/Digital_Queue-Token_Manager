// Socket.io service for handling real-time updates
const Token = require('../models/Token');
const ServiceQueue = require('../models/ServiceQueue');

class SocketService {
  constructor(io) {
    this.io = io;
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join a specific queue room
      socket.on('join_queue_room', (queueId) => {
        socket.join(`queue_${queueId}`);
        console.log(`Socket ${socket.id} joined queue room: ${queueId}`);
      });

      // Join organization room for admin updates
      socket.on('join_org_room', (orgId) => {
        socket.join(`org_${orgId}`);
        console.log(`Socket ${socket.id} joined organization room: ${orgId}`);
      });

      // Handle token status updates
      socket.on('update_token_status', async (data) => {
        try {
          const { tokenId, status, queueId, orgId } = data;
          
          // Update token status in database
          const updatedToken = await Token.updateStatus(tokenId, status);
          
          if (updatedToken) {
            // Emit update to queue room
            this.io.to(`queue_${queueId}`).emit('token_status_updated', {
              token: updatedToken,
              message: `Token status updated to ${status}`
            });

            // Emit update to organization room
            this.io.to(`org_${orgId}`).emit('token_status_updated', {
              token: updatedToken,
              message: `Token status updated to ${status}`
            });

            // Emit to user's personal room if they're tracking this token
            if (updatedToken.user_id) {
              this.io.to(`user_${updatedToken.user_id}`).emit('my_token_updated', {
                token: updatedToken,
                message: `Your token status updated to ${status}`
              });
            }
          }
        } catch (error) {
          console.error('Error updating token status:', error);
          socket.emit('error', { message: 'Failed to update token status' });
        }
      });

      // Handle queue updates (new tokens, position changes, etc.)
      socket.on('queue_update', async (data) => {
        try {
          const { queueId, orgId, action, token } = data;

          // Emit queue update to all connected clients in the queue room
          this.io.to(`queue_${queueId}`).emit('queue_updated', {
            queueId,
            action,
            token,
            timestamp: new Date()
          });

          // Emit to organization room
          this.io.to(`org_${orgId}`).emit('queue_updated', {
            queueId,
            action,
            token,
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Error handling queue update:', error);
          socket.emit('error', { message: 'Failed to handle queue update' });
        }
      });

      // Handle token creation
      socket.on('token_created', async (data) => {
        try {
          const { token, queueId, orgId } = data;

          // Emit to queue room
          this.io.to(`queue_${queueId}`).emit('new_token_added', {
            token,
            message: 'New token added to queue'
          });

          // Emit to organization room
          this.io.to(`org_${orgId}`).emit('new_token_added', {
            token,
            message: 'New token added to queue'
          });

          // Emit to user if available
          if (token.user_id) {
            this.io.to(`user_${token.user_id}`).emit('my_token_created', {
              token,
              message: 'Your token has been created'
            });
          }
        } catch (error) {
          console.error('Error handling token creation:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  // Emit queue status update to specific room
  emitQueueUpdate(queueId, data) {
    this.io.to(`queue_${queueId}`).emit('queue_status_update', data);
  }

  // Emit token update to specific room
  emitTokenUpdate(queueId, data) {
    this.io.to(`queue_${queueId}`).emit('token_update', data);
  }

  // Emit organization update
  emitOrgUpdate(orgId, data) {
    this.io.to(`org_${orgId}`).emit('org_update', data);
  }

  // Emit to specific user
  emitToUser(userId, event, data) {
    this.io.to(`user_${userId}`).emit(event, data);
  }
}

module.exports = SocketService;