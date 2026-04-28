import { Controller, Post } from '@nestjs/common';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  // POST isteği ile çalışır: http://localhost:3000/demo/reset
  @Post('reset')
  async resetDemo() {
    return await this.demoService.resetSystemToGoldenState();
  }
}