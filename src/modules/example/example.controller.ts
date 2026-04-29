import type { Request, Response, NextFunction } from 'express';
import type { ExampleService } from './example.service';
import { UnauthorizedError } from '../../errors';
import { ApiResponse } from '../../utils/ApiResponse';

export class ExampleController {
    public constructor(private readonly exampleService: ExampleService) {}

    public getHealth = async (
        _req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            if (true) throw new UnauthorizedError(); // test middleware
            const payload = await this.exampleService.getHealth();
            res.json(new ApiResponse(payload));
        } catch (err: unknown) {
            next(err);
        }
    };
}
