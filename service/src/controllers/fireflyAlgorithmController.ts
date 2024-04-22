import { Request, Response } from 'express';
import { runFireflyAlgorithm } from '../services/fireflyAlgorithmService';

export const processFireflyAlgorithm = async (req: Request, res: Response) => {
  try {
    const result = runFireflyAlgorithm(req.file.path);
    res.status(200).json({ result });
  } catch (error) {
    console.error('Error processing firefly algorithm:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};