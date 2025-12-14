import { sweetRepository } from '../repositories/sweet.repository';
import { 
  CreateSweetInput, 
  UpdateSweetInput, 
  SearchSweetInput,
  PurchaseInput,
  RestockInput 
} from '../validations/sweet.validation';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const sweetService = {
  async getAllSweets() {
    return sweetRepository.findAll();
  },

  async getSweetById(id: string) {
    const sweet = await sweetRepository.findById(id);
    
    if (!sweet) {
      throw new NotFoundError('Sweet not found');
    }
    
    return sweet;
  },

  async searchSweets(filters: SearchSweetInput) {
    return sweetRepository.search(filters);
  },

  async createSweet(input: CreateSweetInput) {
    return sweetRepository.create(input);
  },

  async updateSweet(id: string, input: UpdateSweetInput) {
    const sweet = await sweetRepository.findById(id);
    
    if (!sweet) {
      throw new NotFoundError('Sweet not found');
    }

    return sweetRepository.update(id, input);
  },

  async deleteSweet(id: string) {
    const sweet = await sweetRepository.findById(id);
    
    if (!sweet) {
      throw new NotFoundError('Sweet not found');
    }

    await sweetRepository.delete(id);
    return { message: 'Sweet deleted successfully' };
  },

  async purchaseSweet(id: string, input: PurchaseInput) {
    const sweet = await sweetRepository.findById(id);
    
    if (!sweet) {
      throw new NotFoundError('Sweet not found');
    }

    if (sweet.quantity < input.quantity) {
      throw new BadRequestError('Insufficient stock');
    }

    const newQuantity = sweet.quantity - input.quantity;
    const updatedSweet = await sweetRepository.updateQuantity(id, newQuantity);

    return {
      message: 'Purchase successful',
      sweet: updatedSweet,
    };
  },

  async restockSweet(id: string, input: RestockInput) {
    const sweet = await sweetRepository.findById(id);
    
    if (!sweet) {
      throw new NotFoundError('Sweet not found');
    }

    const newQuantity = sweet.quantity + input.quantity;
    const updatedSweet = await sweetRepository.updateQuantity(id, newQuantity);

    return {
      message: 'Restock successful',
      sweet: updatedSweet,
    };
  },
};
