import { IGameEntity } from "./interfaces/IGameEntity";
import { DRAW_HEIGHT } from "./main";
import { ResourceManager } from "./resource-manager";
import { randomBetween } from "./utils";

export class PipePair implements IGameEntity {
    // Pipe properties
    public width = 70;
    private vx: number = -80; // Slowed down horizontal speed (was -100)
    
    // Gap properties
    private readonly GAP_SIZE = 150; // Increased gap size (was 100)
    private gapPosition: number; // Position of the gap center
    
    // Pipe heights
    public topPipeHeight: number;
    public bottomPipeHeight: number;

    constructor(public x: number) {
        // Determine where the gap should be
        // More restricted range for gap positioning to make it more playable
        // Keep the gap more in the middle area of the screen
        this.gapPosition = randomBetween(120, DRAW_HEIGHT - 120);
        
        // Calculate pipe heights based on gap position
        this.topPipeHeight = this.gapPosition - this.GAP_SIZE / 2;
        this.bottomPipeHeight = DRAW_HEIGHT - this.gapPosition - this.GAP_SIZE / 2;
    }
    
    render(ctx: CanvasRenderingContext2D): void {
        const resourceManager = ResourceManager.getInstance();
        const pipeImage = resourceManager.get<HTMLImageElement>("/pipe-green.png");
        if (!pipeImage) return;
        
        // Draw top pipe (upside down)
        ctx.save();
        ctx.translate(this.x + this.width/2, this.topPipeHeight/2);
        ctx.scale(1, -1); // Flip vertically
        ctx.drawImage(
            pipeImage, 
            -this.width/2, 
            -this.topPipeHeight/2, 
            this.width, 
            this.topPipeHeight
        );
        ctx.restore();
        
        // Draw bottom pipe
        ctx.drawImage(
            pipeImage,
            this.x, 
            DRAW_HEIGHT - this.bottomPipeHeight, 
            this.width, 
            this.bottomPipeHeight
        );
        
        // Debug visualization of the gap (uncomment for testing)
        /*
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(
            this.x, 
            this.topPipeHeight, 
            this.width, 
            this.GAP_SIZE
        );
        */
    }
    
    update(dt: number) {
        this.x += this.vx * dt;
    }

    // Helper method to get gap bounds for collision detection
    getGapBounds() {
        return {
            top: this.topPipeHeight,
            bottom: DRAW_HEIGHT - this.bottomPipeHeight,
            left: this.x,
            right: this.x + this.width
        };
    }
}