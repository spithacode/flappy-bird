import { IGameEntity } from "./interfaces/IGameEntity";
import { ResourceManager } from "./resource-manager";
import { inputManager } from "./input";

/**
 * Helper function for smooth transitions between values.
 * Moves 'current' value toward 'target' value by the percentage specified in 'amount'.
 */
function lerp(current: number, target: number, amount: number): number {
  if(amount > 1) {
    console.warn("Arg amount is greater than 1. It should be between 0 and 1. ", amount);
    amount = 1;
  }
  return current * (1 - amount) + target * amount;
}

export class Bird implements IGameEntity {
  // Physics properties
  private velocity: { x: number; y: number } = { x: 0, y: 0 };
  private gravity: number = 350; // Reduced gravity (was 400)
  private jumpForce: number = 35; // Increased jump force significantly (was 5)
  private terminalVelocity: number = 500; // Maximum falling speed
  
  // Visual properties
  private wingState: "upflap" | "midflap" | "downflap" = "midflap";
  private rotation: number = 0; // Rotation in radians
  
  // Constants for rotation
  private readonly MAX_DOWNWARD_ANGLE = Math.PI / 4; // 45 degrees
  private readonly MAX_UPWARD_ANGLE = -Math.PI / 6; // -30 degrees
  private readonly ROTATION_SPEED = 0.1; // 0-1 value: higher = faster rotation
  private readonly MAX_CONSIDERED_SPEED = 1000; // Speed that will result in max rotation
  
  // Bird dimensions
  public width: number = 34;
  public height: number = 24;

  constructor(public position: { x: number; y: number }) {}

  /**
   * Normalizes a speed value to a 0-1 range
   * @param speed The value to normalize (typically vertical velocity)
   * @returns A value between 0 and 1 representing the normalized speed
   */
  private normalizeSpeed(speed: number): number {
    // Clamp the value between 0 and 1
    // - 0 means not falling or falling very slowly
    // - 1 means falling at or above the maximum considered speed
    return Math.min(1, Math.max(0, speed / this.MAX_CONSIDERED_SPEED));
  }

  render(ctx: CanvasRenderingContext2D): void {
    const resourceManager = ResourceManager.getInstance();
    const birdImage = resourceManager.get<HTMLImageElement>(`/bird/${this.wingState}.png`);
    if (!birdImage) return;

    // Save context, translate to bird center, rotate, draw, then restore
    ctx.save();
    
    const centerX = this.position.x + this.width / 2;
    const centerY = this.position.y + this.height / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);
    
    ctx.drawImage(
      birdImage,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    
    ctx.restore();
  }
  
  update(dt: number) {
    // Handle jump input
    if (inputManager.isKeyPressed(" ")) {
      // Apply upward force when Space is pressed
      this.velocity.y = -this.gravity * this.jumpForce * dt;
      
      // When jumping, immediately rotate bird upward
      this.rotation = this.MAX_UPWARD_ANGLE;
    } else {
      // Apply gravity when not jumping
      this.velocity.y += this.gravity * dt;
      
      // Limit falling speed to terminal velocity
      if (this.velocity.y > this.terminalVelocity) {
        this.velocity.y = this.terminalVelocity;
      }
      
      // Calculate a target rotation based on falling speed
      
      // Step 1: Convert velocity to a 0-1 scale
      const normalizedSpeed = this.normalizeSpeed(this.velocity.y);
      
      // Step 2: Calculate the target angle based on normalized speed
      // - At 0 speed: 0 degrees (level)
      // - At max speed: MAX_DOWNWARD_ANGLE (45 degrees nose-down)
      const targetRotation = normalizedSpeed * this.MAX_DOWNWARD_ANGLE;
      
      // Step 3: Gradually rotate toward the target angle
      // Use lerp to smoothly transition between current and target rotation
      this.rotation = lerp(
        this.rotation,       // Current rotation
        targetRotation,      // Target rotation
        this.ROTATION_SPEED  // How quickly to rotate (0.1 = 10% toward target per frame)
      );
    }

    // Update position
    this.position.y += this.velocity.y * dt;

    // Update wing animation based on velocity direction
    if (this.velocity.y > 0) {
      this.wingState = "downflap"; // Moving down
    } else if (this.velocity.y < 0) {
      this.wingState = "upflap";   // Moving up
    } else {
      this.wingState = "midflap";  // Not moving vertically
    }
  }
  
  // Reset bird state for game restart
  reset(): void {
    this.velocity = { x: 0, y: 0 };
    this.rotation = 0;
    this.wingState = "midflap";
  }
}
