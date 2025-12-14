import { Request, Response, NextFunction } from 'express';
import { sweetService } from '../services/sweet.service';

export const sweetController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const sweets = await sweetService.getAllSweets();
      res.status(200).json(sweets);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const sweet = await sweetService.getSweetById(req.params.id);
      res.status(200).json(sweet);
    } catch (error) {
      next(error);
    }
  },

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const sweets = await sweetService.searchSweets(req.query as any);
      res.status(200).json(sweets);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const sweet = await sweetService.createSweet(req.body);
      res.status(201).json(sweet);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const sweet = await sweetService.updateSweet(req.params.id, req.body);
      res.status(200).json(sweet);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await sweetService.deleteSweet(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async purchase(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await sweetService.purchaseSweet(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async restock(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await sweetService.restockSweet(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
