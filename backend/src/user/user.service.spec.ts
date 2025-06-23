import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', () => {
      const createUserDto: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
      };

      const result = service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.uuid).toBeDefined();
      expect(result.firstname).toBe('John');
      expect(result.lastname).toBe('Doe');
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should generate unique UUIDs for different users', () => {
      const createUserDto1: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
      };
      const createUserDto2: CreateUserDto = {
        firstname: 'Jane',
        lastname: 'Smith',
      };

      const user1 = service.create(createUserDto1);
      const user2 = service.create(createUserDto2);

      expect(user1.uuid).not.toBe(user2.uuid);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', () => {
      const createUserDto: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
      };

      const createdUser = service.create(createUserDto);
      const foundUser = service.findOne(createdUser.uuid);

      expect(foundUser).toBeDefined();
      expect(foundUser.uuid).toBe(createdUser.uuid);
      expect(foundUser.firstname).toBe('John');
      expect(foundUser.lastname).toBe('Doe');
    });

    it('should throw NotFoundException when user not found', () => {
      const nonExistentUuid = 'non-existent-uuid';

      expect(() => service.findOne(nonExistentUuid)).toThrow(NotFoundException);
      expect(() => service.findOne(nonExistentUuid)).toThrow(
        `User with uuid ${nonExistentUuid} not found`,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing user', () => {
      const createUserDto: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
      };

      const createdUser = service.create(createUserDto);
      const result = service.remove(createdUser.uuid);

      expect(result).toBeDefined();
      expect(result.message).toBe(
        `User with uuid ${createdUser.uuid} has been removed`,
      );

      // Verify user is actually removed
      expect(() => service.findOne(createdUser.uuid)).toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when trying to remove non-existent user', () => {
      const nonExistentUuid = 'non-existent-uuid';

      expect(() => service.remove(nonExistentUuid)).toThrow(NotFoundException);
      expect(() => service.remove(nonExistentUuid)).toThrow(
        `User with uuid ${nonExistentUuid} not found`,
      );
    });
  });

  describe('integration tests', () => {
    it('should handle multiple users correctly', () => {
      const user1Dto: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
      };
      const user2Dto: CreateUserDto = {
        firstname: 'Jane',
        lastname: 'Smith',
      };

      // Create users
      const user1 = service.create(user1Dto);
      const user2 = service.create(user2Dto);

      // Both should be findable
      expect(service.findOne(user1.uuid)).toBeDefined();
      expect(service.findOne(user2.uuid)).toBeDefined();

      // Remove first user
      service.remove(user1.uuid);

      // First should be gone, second should still exist
      expect(() => service.findOne(user1.uuid)).toThrow(NotFoundException);
      expect(service.findOne(user2.uuid)).toBeDefined();
    });
  });
});
