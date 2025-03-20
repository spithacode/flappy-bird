import { IGameEntity } from "./interfaces/IGameEntity";
import { ResourceManager } from "./resource-manager";
import { inputManager } from "./input";

export class Bird implements IGameEntity {
  private v: { x: number; y: number } = { x: 0, y: 0 }; // Velocity: change in position with respect to time
  private a: { x: number; y: number } = { x: 0, y: 400 }; // Acceleration: change in velocity with respect to time
  private facingDirection: "up" | "down" | "mid" = "mid";

  public width: number = 34;
  public height: number = 24;

  constructor(public position: { x: number; y: number }) {}

  render(ctx: CanvasRenderingContext2D): void {
    const resourceManager = ResourceManager.getInstance();
    const birdImage = resourceManager.get<HTMLImageElement>(
      `/bird/${this.facingDirection}flap.png`,
    );
    if (!birdImage) return;

    ctx.beginPath();
    ctx.drawImage(
      birdImage,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    );
  }
  update(dt: number) {
    // Check for Space key directly instead of using the Action system

    console.log(inputManager)
    if (inputManager.isKeyPressed(" ")) {
      this.v.y += -this.a.y * 4 * dt;
    } else {
      this.v.y += this.a.y * dt;
    }

    this.position.y += this.v.y * dt;

    if (this.v.y > 0) {
      this.facingDirection = "up";
    } else if (this.v.y < 0) {
      this.facingDirection = "down";
    } else {
      this.facingDirection = "mid";
    }
  }
}
