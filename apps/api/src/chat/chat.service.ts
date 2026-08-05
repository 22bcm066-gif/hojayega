import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(taskId: string, userId: string) {
    await this.requireParticipant(taskId, userId);
    const chat = await this.prisma.chat.findUnique({
      where: { taskId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { name: true, avatarUrl: true } } },
        },
      },
    });
    if (!chat)
      throw new NotFoundException('Chat not started for this task yet');
    return chat;
  }

  async sendMessage(taskId: string, senderId: string, dto: SendMessageDto) {
    await this.requireParticipant(taskId, senderId);
    const chat = await this.prisma.chat.findUnique({ where: { taskId } });
    if (!chat)
      throw new BadRequestException('Chat not started for this task yet');
    if (!dto.content && !dto.mediaUrl)
      throw new BadRequestException('Message must have content or media');

    return this.prisma.message.create({
      data: {
        chatId: chat.id,
        senderId,
        type: dto.type ?? 'TEXT',
        content: dto.content,
        mediaUrl: dto.mediaUrl,
      },
      include: { sender: { select: { name: true, avatarUrl: true } } },
    });
  }

  private async requireParticipant(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { helper: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    const isParticipant =
      task.customerId === userId || task.helper?.userId === userId;
    if (!isParticipant) throw new ForbiddenException('Not part of this task');
    return task;
  }
}
