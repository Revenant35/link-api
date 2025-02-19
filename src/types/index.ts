// This file contains TypeScript interfaces and types used in the Socket.IO server application.

export interface ConnectionPayload {
    userId: string;
    username: string;
}

export interface MessagePayload {
    senderId: string;
    recipientId: string;
    message: string;
    timestamp: Date;
}

export interface DisconnectPayload {
    userId: string;
    reason: string;
}