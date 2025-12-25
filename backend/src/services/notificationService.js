// Service for handling notifications via various channels
const db = require('../config/database');
const redis = require('../config/redis');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const Queue = require('bull');

class NotificationService {
  constructor(io) {
    this.io = io;
    
    // Create Bull queues for different notification types
    this.smsQueue = new Queue('sms notifications', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      }
    });
    
    this.emailQueue = new Queue('email notifications', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      }
    });
    
    this.pushQueue = new Queue('push notifications', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      }
    });
    
    this.voiceQueue = new Queue('voice notifications', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      }
    });
    
    // Process notification queues
    this.setupQueueProcessors();
    
    // Setup Bull Board for monitoring
    this.setupBullBoard();
  }

  setupQueueProcessors() {
    // Process SMS notifications
    this.smsQueue.process(async (job) => {
      const { token, user, message } = job.data;
      return this.sendSMSNotification(token, user, message);
    });

    // Process email notifications
    this.emailQueue.process(async (job) => {
      const { token, user, subject, message } = job.data;
      return this.sendEmailNotification(token, user, subject, message);
    });

    // Process push notifications
    this.pushQueue.process(async (job) => {
      const { token, user, title, body } = job.data;
      return this.sendPushNotification(token, user, title, body);
    });

    // Process voice notifications
    this.voiceQueue.process(async (job) => {
      const { token, user, message } = job.data;
      return this.sendVoiceNotification(token, user, message);
    });
  }

  setupBullBoard() {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');
    
    createBullBoard({
      queues: [
        new BullAdapter(this.smsQueue),
        new BullAdapter(this.emailQueue),
        new BullAdapter(this.pushQueue),
        new BullAdapter(this.voiceQueue)
      ],
      serverAdapter: serverAdapter
    });
  }

  // Add notification to appropriate queue based on type
  async addNotificationToQueue(notificationType, token, user, data) {
    const jobData = {
      token,
      user,
      ...data,
      timestamp: new Date()
    };

    switch (notificationType) {
      case 'sms':
        return await this.smsQueue.add('send-sms', jobData, {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        });
      case 'email':
        return await this.emailQueue.add('send-email', jobData, {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        });
      case 'push':
        return await this.pushQueue.add('send-push', jobData, {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        });
      case 'voice':
        return await this.voiceQueue.add('send-voice', jobData, {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        });
      default:
        throw new Error(`Unknown notification type: ${notificationType}`);
    }
  }

  // Send SMS notification (placeholder implementation)
  async sendSMSNotification(token, user, message) {
    try {
      // In a real implementation, this would integrate with an SMS service like Twilio
      console.log(`Sending SMS to ${user.phone}: ${message}`);
      
      // Store notification record in database
      await this.storeNotificationRecord(token.id, user.id, 'sms', message, 'sent');
      
      return { success: true, method: 'sms', recipient: user.phone };
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      await this.storeNotificationRecord(token.id, user.id, 'sms', message, 'failed', error.message);
      return { success: false, method: 'sms', error: error.message };
    }
  }

  // Send email notification
  async sendEmailNotification(token, user, subject, message) {
    try {
      // In a real implementation, this would use nodemailer or similar
      const nodemailer = require('nodemailer');
      
      // Create transporter
      const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Send email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: subject,
        text: message,
        html: `<p>${message}</p>`,
      });

      console.log('Email sent: ' + info.messageId);
      
      // Store notification record in database
      await this.storeNotificationRecord(token.id, user.id, 'email', message, 'sent');
      
      return { success: true, method: 'email', messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email notification:', error);
      await this.storeNotificationRecord(token.id, user.id, 'email', message, 'failed', error.message);
      return { success: false, method: 'email', error: error.message };
    }
  }

  // Send push notification via Firebase
  async sendPushNotification(token, user, title, body) {
    try {
      // In a real implementation, this would use Firebase Admin SDK
      const admin = require('firebase-admin');
      
      // Initialize Firebase Admin if not already initialized
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            type: process.env.FIREBASE_TYPE,
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
          })
        });
      }

      // For now, we'll just log the notification since we don't have device tokens
      console.log(`Push notification to user ${user.id}: ${title} - ${body}`);
      
      // Store notification record in database
      await this.storeNotificationRecord(token.id, user.id, 'push', `${title} - ${body}`, 'sent');
      
      return { success: true, method: 'push' };
    } catch (error) {
      console.error('Error sending push notification:', error);
      await this.storeNotificationRecord(token.id, user.id, 'push', `${title} - ${body}`, 'failed', error.message);
      return { success: false, method: 'push', error: error.message };
    }
  }

  // Send voice notification (placeholder implementation)
  async sendVoiceNotification(token, user, message) {
    try {
      // In a real implementation, this would integrate with a voice service like Twilio
      console.log(`Sending voice notification to ${user.phone}: ${message}`);
      
      // Store notification record in database
      await this.storeNotificationRecord(token.id, user.id, 'voice', message, 'sent');
      
      return { success: true, method: 'voice', recipient: user.phone };
    } catch (error) {
      console.error('Error sending voice notification:', error);
      await this.storeNotificationRecord(token.id, user.id, 'voice', message, 'failed', error.message);
      return { success: false, method: 'voice', error: error.message };
    }
  }

  // Store notification record in database
  async storeNotificationRecord(tokenId, userId, type, message, status, error = null) {
    const query = `
      INSERT INTO notifications (token_id, user_id, type, message, status, sent_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    
    const sentAt = status === 'sent' ? new Date() : null;
    
    try {
      const result = await db.query(query, [tokenId, userId, type, message, status, sentAt]);
      return result.rows[0].id;
    } catch (error) {
      console.error('Error storing notification record:', error);
    }
  }

  // Schedule notifications for token status updates
  async scheduleTokenNotifications(token, user, orgName, queueName) {
    // Calculate when to send notifications based on token position
    const tokensAhead = token.token_position - 1; // Assuming this is the user's position
    const avgServiceTime = 10; // Average service time in minutes (would come from queue settings)
    
    // Send notification when user is 5 tokens away
    if (tokensAhead >= 5) {
      const whenT5 = new Date(Date.now() + (tokensAhead - 5) * avgServiceTime * 60 * 1000);
      await this.addNotificationToQueue('push', token, user, {
        title: 'Q-Ease: Almost Your Turn!',
        body: `You are 5 tokens away from your turn at ${orgName} for ${queueName}. Prepare to be served soon!`,
        delay: whenT5.getTime() - Date.now()
      });
    }
    
    // Send notification when user is 2 tokens away
    if (tokensAhead >= 2) {
      const whenT2 = new Date(Date.now() + (tokensAhead - 2) * avgServiceTime * 60 * 1000);
      await this.addNotificationToQueue('sms', token, user, {
        message: `Q-Ease: You are 2 tokens away from your turn at ${orgName} for ${queueName}.`,
        delay: whenT2.getTime() - Date.now()
      });
    }
    
    // Send notification when it's the user's turn
    const whenTurn = new Date(Date.now() + tokensAhead * avgServiceTime * 60 * 1000);
    await this.addNotificationToQueue('voice', token, user, {
      message: `Q-Ease: It's your turn now at ${orgName} for ${queueName}. Please proceed to the counter.`,
      delay: whenTurn.getTime() - Date.now()
    });
  }

  // Get Bull Board app for monitoring
  getBullBoardApp() {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');
    
    createBullBoard({
      queues: [
        new BullAdapter(this.smsQueue),
        new BullAdapter(this.emailQueue),
        new BullAdapter(this.pushQueue),
        new BullAdapter(this.voiceQueue)
      ],
      serverAdapter: serverAdapter
    });
    
    return serverAdapter.getRouter();
  }
}

module.exports = NotificationService;