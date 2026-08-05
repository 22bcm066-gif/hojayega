import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

interface AuthedSocket extends Socket {
  data: { userId: string };
}

/**
 * Realtime chat + live-location channel. Clients connect with
 * `io(url, { auth: { token } })` using their access token, then
 * `socket.emit('join', { taskId })` to subscribe to that task's room.
 */
@WebSocketGateway({ namespace: '/realtime', cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  handleConnection(socket: AuthedSocket) {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) throw new Error('Missing token');
      const payload = this.jwt.verify<{ sub: string }>(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });
      socket.data.userId = payload.sub;
    } catch {
      this.logger.warn(`Rejecting unauthenticated socket ${socket.id}`);
      socket.disconnect(true);
    }
  }

  @SubscribeMessage('join')
  async onJoin(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() body: { taskId: string },
  ) {
    await socket.join(this.room(body.taskId));
    return { joined: body.taskId };
  }

  @SubscribeMessage('message')
  async onMessage(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() body: { taskId: string } & SendMessageDto,
  ) {
    const message = await this.chatService.sendMessage(
      body.taskId,
      socket.data.userId,
      body,
    );
    this.server.to(this.room(body.taskId)).emit('message', message);
    return message;
  }

  @SubscribeMessage('helper:location')
  onHelperLocation(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() body: { taskId: string; lat: number; lng: number },
  ) {
    this.server.to(this.room(body.taskId)).emit('helper:location', {
      lat: body.lat,
      lng: body.lng,
      at: new Date().toISOString(),
    });
  }

  broadcastMessage(taskId: string, message: unknown) {
    this.server?.to(this.room(taskId)).emit('message', message);
  }

  broadcastTaskUpdate(taskId: string, task: unknown) {
    this.server?.to(this.room(taskId)).emit('task:update', task);
  }

  private room(taskId: string) {
    return `task:${taskId}`;
  }
}
