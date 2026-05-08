interface Notification {
  id: number;
  userId: string;
  type: string; // e.g. "room.created", "user.joined", "draw.completed"
  message: string;
  read: boolean;
  createdAt: string; // ISO timestamp
}

type NotificationDTO = Pick<Notification, 'userId' | 'type' | 'message'>;

export { Notification, NotificationDTO };
