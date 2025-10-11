import { storage } from "../storage";
import crypto from "crypto";

// For now using console logging - in production this would integrate with Twilio SMS
export class PhoneVerificationService {
  private static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendVerificationCode(phone: string, ipAddress?: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check rate limiting
      const attempts = await storage.getPhoneVerificationAttempts(phone, ipAddress);
      if (attempts && attempts.attemptCount >= 5 && attempts.blockedUntil && attempts.blockedUntil > new Date()) {
        return {
          success: false,
          message: `Too many attempts. Try again after ${attempts.blockedUntil.toLocaleTimeString()}`
        };
      }

      // Generate 6-digit code
      const code = this.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store verification code
      await storage.createPhoneVerificationAttempt({
        phone,
        ipAddress,
        attemptCount: (attempts?.attemptCount || 0) + 1,
        lastAttempt: new Date(),
        blockedUntil: (attempts?.attemptCount || 0) >= 4 ? new Date(Date.now() + 60 * 60 * 1000) : null // Block for 1 hour after 5 attempts
      });

      // Update user with verification code
      await storage.updateUserPhoneVerification(phone, code, expiresAt);

      // In production, send SMS via Twilio
      console.log(`📱 PHONE VERIFICATION: Send "${code}" to ${phone} (expires in 10 minutes)`);
      
      return {
        success: true,
        message: "Verification code sent successfully"
      };
    } catch (error) {
      console.error("Error sending verification code:", error);
      return {
        success: false,
        message: "Failed to send verification code. Please try again."
      };
    }
  }

  static async verifyPhoneCode(phone: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return {
          success: false,
          message: "User not found"
        };
      }

      if (!user.phoneVerificationCode || user.phoneVerificationCode !== code) {
        return {
          success: false,
          message: "Invalid verification code"
        };
      }

      if (!user.phoneVerificationExpiresAt || user.phoneVerificationExpiresAt < new Date()) {
        return {
          success: false,
          message: "Verification code has expired"
        };
      }

      // Mark phone as verified
      await storage.markPhoneAsVerified(user.id);

      return {
        success: true,
        message: "Phone verified successfully"
      };
    } catch (error) {
      console.error("Error verifying phone code:", error);
      return {
        success: false,
        message: "Verification failed. Please try again."
      };
    }
  }

  static generateDeviceFingerprint(userAgent?: string, ipAddress?: string): string {
    const data = `${userAgent || 'unknown'}-${ipAddress || 'unknown'}-${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static async createUserSession(userId: number, deviceInfo: any): Promise<string> {
    const sessionId = crypto.randomUUID();
    const deviceFingerprint = this.generateDeviceFingerprint(deviceInfo.userAgent, deviceInfo.ipAddress);
    
    // Check existing sessions for this user
    const existingSessions = await storage.getActiveUserSessions(userId);
    const user = await storage.getUser(userId);
    
    if (existingSessions.length >= (user?.maxSessions || 1)) {
      // Terminate oldest session
      await storage.terminateOldestSession(userId);
    }

    await storage.createUserSession({
      userId,
      sessionId,
      deviceFingerprint,
      deviceInfo,
      ipAddress: deviceInfo.ipAddress,
      userAgent: deviceInfo.userAgent,
      location: deviceInfo.location || null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    return sessionId;
  }

  static async validateSession(sessionId: string): Promise<{ valid: boolean; userId?: number }> {
    const session = await storage.getUserSessionBySessionId(sessionId);
    
    if (!session || !session.isActive || (session.expiresAt && session.expiresAt < new Date())) {
      return { valid: false };
    }

    // Update last activity
    await storage.updateSessionActivity(sessionId);

    return { valid: true, userId: session.userId };
  }

  static async terminateSession(sessionId: string): Promise<void> {
    await storage.terminateUserSession(sessionId);
  }

  static async detectSuspiciousActivity(userId: number, deviceInfo: any): Promise<boolean> {
    const user = await storage.getUser(userId);
    if (!user) return false;

    const newFingerprint = this.generateDeviceFingerprint(deviceInfo.userAgent, deviceInfo.ipAddress);
    
    // Check if this is a completely new device
    if (user.deviceFingerprint && user.deviceFingerprint !== newFingerprint) {
      // Log suspicious activity
      await storage.createSecurityLog({
        userId,
        eventType: 'device_change',
        details: {
          oldFingerprint: user.deviceFingerprint,
          newFingerprint,
          deviceInfo
        },
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent,
        severity: 'medium'
      });

      // Update user's device fingerprint
      await storage.updateUserDeviceFingerprint(userId, newFingerprint);
      
      return true;
    }

    return false;
  }
}