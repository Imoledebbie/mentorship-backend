import { Request, Response } from 'express';

function test(req: Request, res: Response) {
  res.send('test');
}
