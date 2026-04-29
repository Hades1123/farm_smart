import { Router } from 'express';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

const router = Router();

const exampleService = new ExampleService();
const exampleController = new ExampleController(exampleService);

// localhost:8000/api/example/health
router.get('/health', exampleController.getHealth);

export default router;
