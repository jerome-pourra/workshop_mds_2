import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UserService } from '../user/user.service';
import { Conversation } from './entities/conversation.entity';
import { User } from '../user/entities/user.entity';
import {
  CreateConversationDto,
  JoinConversationDto,
  LeaveConversationDto,
} from './dto/conversation.dto';
import { CreateUserDto } from '../user/dto/user.dto';

describe('ConversationService', () => {
  let conversationService: ConversationService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationService, UserService],
    }).compile();

    conversationService = module.get<ConversationService>(ConversationService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(conversationService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new conversation with valid user', () => {
      // Create a user first
      const createUserDto: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
      };
      const user = userService.create(createUserDto);

      // Create conversation
      const createConversationDto: CreateConversationDto = {
        userId: user.uuid,
      };
      const result = conversationService.create(createConversationDto);

      expect(result).toBeDefined();
      expect(result.uuid).toBeDefined();
      expect(result.owner).toEqual(user);
      expect(result.participants).toEqual([]);
    });

    it('should throw NotFoundException when user does not exist', () => {
      const createConversationDto: CreateConversationDto = {
        userId: 'non-existent-user-uuid',
      };

      expect(() => conversationService.create(createConversationDto)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('join', () => {
    let conversation: Conversation;
    let user1: User;
    let user2: User;

    beforeEach(() => {
      // Create users
      user1 = userService.create({ firstname: 'John', lastname: 'Doe' });
      user2 = userService.create({ firstname: 'Jane', lastname: 'Smith' });

      // Create conversation
      conversation = conversationService.create({ userId: user1.uuid });
    });

    it('should allow user to join conversation', () => {
      const joinConversationDto: JoinConversationDto = {
        userId: user2.uuid,
      };

      const result = conversationService.join(
        conversation.uuid,
        joinConversationDto,
      );

      expect(result).toBeDefined();
      expect(result.participants).toHaveLength(1);
      expect(result.participants[0]).toEqual(user2);
    });

    it('should throw NotFoundException when conversation does not exist', () => {
      const joinConversationDto: JoinConversationDto = {
        userId: user2.uuid,
      };

      expect(() =>
        conversationService.join(
          'non-existent-conversation-uuid',
          joinConversationDto,
        ),
      ).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user does not exist', () => {
      const joinConversationDto: JoinConversationDto = {
        userId: 'non-existent-user-uuid',
      };

      expect(() =>
        conversationService.join(conversation.uuid, joinConversationDto),
      ).toThrow(NotFoundException);
    });

    it('should throw ConflictException when user is already a participant', () => {
      const joinConversationDto: JoinConversationDto = {
        userId: user2.uuid,
      };

      // Join first time
      conversationService.join(conversation.uuid, joinConversationDto);

      // Try to join again
      expect(() =>
        conversationService.join(conversation.uuid, joinConversationDto),
      ).toThrow(ConflictException);
    });
  });

  describe('leave', () => {
    let conversation: Conversation;
    let user1: User;
    let user2: User;

    beforeEach(() => {
      // Create users
      user1 = userService.create({ firstname: 'John', lastname: 'Doe' });
      user2 = userService.create({ firstname: 'Jane', lastname: 'Smith' });

      // Create conversation and join user2
      conversation = conversationService.create({ userId: user1.uuid });
      conversationService.join(conversation.uuid, { userId: user2.uuid });
    });

    it('should allow user to leave conversation', () => {
      const leaveConversationDto: LeaveConversationDto = {
        userId: user2.uuid,
      };

      const result = conversationService.leave(
        conversation.uuid,
        leaveConversationDto,
      );

      expect(result).toBeDefined();
      expect(result.participants).toHaveLength(0);
    });

    it('should throw NotFoundException when conversation does not exist', () => {
      const leaveConversationDto: LeaveConversationDto = {
        userId: user2.uuid,
      };

      expect(() =>
        conversationService.leave(
          'non-existent-conversation-uuid',
          leaveConversationDto,
        ),
      ).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user does not exist', () => {
      const leaveConversationDto: LeaveConversationDto = {
        userId: 'non-existent-user-uuid',
      };

      expect(() =>
        conversationService.leave(conversation.uuid, leaveConversationDto),
      ).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user is not a participant', () => {
      const user3 = userService.create({
        firstname: 'Bob',
        lastname: 'Wilson',
      });
      const leaveConversationDto: LeaveConversationDto = {
        userId: user3.uuid,
      };

      expect(() =>
        conversationService.leave(conversation.uuid, leaveConversationDto),
      ).toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return conversation when found', () => {
      const user = userService.create({ firstname: 'John', lastname: 'Doe' });
      const conversation = conversationService.create({ userId: user.uuid });

      const result = conversationService.findOne(conversation.uuid);

      expect(result).toBeDefined();
      expect(result.uuid).toBe(conversation.uuid);
      expect(result.owner).toEqual(user);
    });

    it('should throw NotFoundException when conversation not found', () => {
      expect(() =>
        conversationService.findOne('non-existent-conversation-uuid'),
      ).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove existing conversation', () => {
      const user = userService.create({ firstname: 'John', lastname: 'Doe' });
      const conversation = conversationService.create({ userId: user.uuid });

      const result = conversationService.remove(conversation.uuid);

      expect(result).toBeDefined();
      expect(result.message).toBe(
        `Conversation with uuid ${conversation.uuid} has been removed`,
      );

      // Verify conversation is actually removed
      expect(() => conversationService.findOne(conversation.uuid)).toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when trying to remove non-existent conversation', () => {
      expect(() =>
        conversationService.remove('non-existent-conversation-uuid'),
      ).toThrow(NotFoundException);
    });
  });

  describe('integration tests', () => {
    it('should handle complete conversation lifecycle', () => {
      // Create users
      const user1 = userService.create({ firstname: 'John', lastname: 'Doe' });
      const user2 = userService.create({
        firstname: 'Jane',
        lastname: 'Smith',
      });
      const user3 = userService.create({
        firstname: 'Bob',
        lastname: 'Wilson',
      });

      // Create conversation
      const conversation = conversationService.create({ userId: user1.uuid });
      expect(conversation.owner).toEqual(user1);
      expect(conversation.participants).toHaveLength(0);

      // Users join
      conversationService.join(conversation.uuid, { userId: user2.uuid });
      conversationService.join(conversation.uuid, { userId: user3.uuid });

      const updatedConversation = conversationService.findOne(
        conversation.uuid,
      );
      expect(updatedConversation.participants).toHaveLength(2);

      // One user leaves
      conversationService.leave(conversation.uuid, { userId: user2.uuid });

      const finalConversation = conversationService.findOne(conversation.uuid);
      expect(finalConversation.participants).toHaveLength(1);
      expect(finalConversation.participants[0]).toEqual(user3);

      // Remove conversation
      conversationService.remove(conversation.uuid);
      expect(() => conversationService.findOne(conversation.uuid)).toThrow(
        NotFoundException,
      );
    });

    it('should handle multiple conversations independently', () => {
      const user1 = userService.create({ firstname: 'John', lastname: 'Doe' });
      const user2 = userService.create({
        firstname: 'Jane',
        lastname: 'Smith',
      });

      // Create two conversations
      const conv1 = conversationService.create({ userId: user1.uuid });
      const conv2 = conversationService.create({ userId: user2.uuid });

      // Join user2 to conv1
      conversationService.join(conv1.uuid, { userId: user2.uuid });

      // Verify both conversations exist and are independent
      const foundConv1 = conversationService.findOne(conv1.uuid);
      const foundConv2 = conversationService.findOne(conv2.uuid);

      expect(foundConv1.participants).toHaveLength(1);
      expect(foundConv2.participants).toHaveLength(0);
      expect(foundConv1.owner).toEqual(user1);
      expect(foundConv2.owner).toEqual(user2);
    });
  });
});
