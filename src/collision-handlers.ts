import { Bird } from "./Bird";
import { DRAW_HEIGHT } from "./main";
import { PipePair } from "./PipePair";

export function isBirdCollidingWithPipes(bird: Bird, pipePairs: PipePair[]) {
  for (const pipe of pipePairs) {
    // Check if bird is within the pipe's horizontal range
    if (bird.position.x + bird.width >= pipe.x && 
        bird.position.x <= pipe.x + pipe.width) {
      
      // Check if bird is colliding with top pipe
      const collidingWithTopPipe = bird.position.y <= pipe.topPipeHeight;
      
      // Check if bird is colliding with bottom pipe
      const collidingWithBottomPipe = 
        bird.position.y + bird.height >= DRAW_HEIGHT - pipe.bottomPipeHeight;
      
      if (collidingWithTopPipe || collidingWithBottomPipe) {
        return { isColliding: true, pipe };
      }
    }
  }

  return { isColliding: false, pipe: null };
}

export function isBirdCollidingWithGround(bird: Bird) {
  return bird.position.y + bird.height >= DRAW_HEIGHT;
}

