import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validations/auth.validation';
import { UnauthorizedError, ConflictError } from '../utils/errors';

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);
    
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    
    const user = await userRepository.create({
      email: input.email,
      password: hashedPassword,
      name: input.name,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);
    
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  },
};
