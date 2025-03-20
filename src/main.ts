import { Bird } from "./Bird";
import {
  isBirdCollidingWithGround,
  isBirdCollidingWithPipes,
} from "./collision-handlers";
import { GameLoop } from "./game-loop";
import { IGameEntity } from "./interfaces/IGameEntity";
import { PipePair } from "./PipePair";
import { ResourceManager } from "./resource-manager";
import "./style.css";
import { randomBetween } from "./utils";
import { initializeInputManager } from "./input";
import { ScoreLabel } from "./ScoreLabel";

const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;

if (canvas === null) throw new Error("Canvas is not defined");
const ctx = canvas.getContext("2d"); // The pen which we will use to things

// Initialize all managers
const resourceManager = ResourceManager.getInstance();
initializeInputManager(canvas);
const gameLoop = GameLoop.getInstance();

// Game constants
export const WIDTH = canvas.width;
export const HEIGHT = canvas.height;
export const DRAW_OFFSET = 80;
export const DRAW_HEIGHT = HEIGHT - DRAW_OFFSET;
let DISTANCE_BETWEEN_PIPES = 250;

// Create game entities
const bird = new Bird({ x: 100, y: 100 });
const scoreLabel = new ScoreLabel({ x: WIDTH / 2, y: 100 });

let gameEntities: IGameEntity[] = [new PipePair(400), bird, scoreLabel];

// Track pipes that have been scored
const scoredPipes = new Set<PipePair>();

if (ctx === null) throw new Error("Ctx is not defined");

let prevRandomizationTime = 0;

const update = (dt: number) => {
  if (gameLoop.time - prevRandomizationTime >= 1000) {
    DISTANCE_BETWEEN_PIPES = randomBetween(200, 300);
    prevRandomizationTime = gameLoop.time;
    console.log("randomized", DISTANCE_BETWEEN_PIPES);
  }

  gameEntities.forEach((entity, index, entities) => {
    entity.update(dt);

    if (entity instanceof PipePair) {
      const pipePair = entity as PipePair;

      // Check if the bird has passed the pipe to award points
      if (!scoredPipes.has(pipePair) && pipePair.x + pipePair.width < bird.position.x) {
        scoreLabel.incrementScore();
        scoredPipes.add(pipePair);
        
        // Play score sound
        const scoreSound = resourceManager.get<HTMLAudioElement>("/audio/point.wav");
        if (scoreSound) {
          scoreSound.currentTime = 0;
          scoreSound.play().catch(err => console.error("Error playing score sound:", err));
        }
      }

      if (pipePair.x + pipePair.width <= 0) {
        // Remove from scored pipes set when removing from game
        scoredPipes.delete(pipePair);
        entities.splice(index, 1);
      }
    }
  });

  // spawn new pipes
  const pipes = gameEntities.filter(
    (entity) => entity instanceof PipePair,
  ) as PipePair[];
  const lastPipe = pipes[pipes.length - 1];

  if (isBirdCollidingWithGround(bird)) {
    console.log("Died");
    const dieAudio = resourceManager.get<HTMLAudioElement>("/audio/die.wav");

    console.log(resourceManager.resourceMap);
    if (dieAudio) {
      console.log(dieAudio);
      dieAudio.play();
    }
    gameLoop.stop();
  }
  if (isBirdCollidingWithPipes(bird, pipes).isColliding) {
    console.log("Died");

    const hitAudio = resourceManager.get<HTMLAudioElement>("/audio/hit.wav");
    console.log(resourceManager.resourceMap);
    if (hitAudio) {
      console.log(hitAudio);
      hitAudio.play();
    }

    gameLoop.stop();
  }

  const distance = WIDTH - lastPipe.x;
  if (distance >= DISTANCE_BETWEEN_PIPES) {
    gameEntities.push(new PipePair(WIDTH));
  }
};

const render = () => {
  // draw the game objects every frame
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const backgroundImage = resourceManager.get<HTMLImageElement>(
    "/background-day.png",
  );
  const baseImage = resourceManager.get<HTMLImageElement>("/base.png");
  if (backgroundImage) {
    ctx.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT);
  }
  if (baseImage) {
    ctx.drawImage(
      baseImage,
      0, // sx
      0, //sy

      baseImage.width, // sw
      baseImage.height, // sh
      0, // dx
      DRAW_HEIGHT, // dy
      WIDTH, // dw
      DRAW_OFFSET, // dh
    );
  }
  gameEntities.forEach((entity) => {
    entity.render(ctx);
  });
};

// Reset game function for potential restart
export function resetGame() {
  // Clear existing entities
  gameEntities = [];
  scoredPipes.clear();
  
  // Reset bird
  bird.reset();
  bird.position = { x: 100, y: 100 };
  
  // Reset score
  scoreLabel.resetScore();
  
  // Add entities back
  gameEntities = [new PipePair(400), bird, scoreLabel];
  
  // Restart game loop if needed
  if (!gameLoop.running) {
    gameLoop.start(update, render);
  }
}

console.log("Starting the game");
gameLoop.start(update, render);
