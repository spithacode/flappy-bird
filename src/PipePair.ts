import { IGameEntity } from "./interfaces/IGameEntity";
import {  DRAW_HEIGHT } from "./main";
import { ResourceManager } from "./resource-manager";
import { randomBetween } from "./utils";

export class PipePair implements IGameEntity {
    private margin = 50;
    public firstPipeHeight = randomBetween(DRAW_HEIGHT * 0.4, DRAW_HEIGHT / 2 - this.margin * 2);
    public secondPipeHeight = randomBetween(DRAW_HEIGHT * 0.4, DRAW_HEIGHT / 2 - this.margin * 2);
    public width = 70;
    private vx: number = -100;
    public scored: boolean = false;

    constructor(
        public x: number,
    ) {

    }
    render(ctx: CanvasRenderingContext2D): void {
        const resourceManager = ResourceManager.getInstance()
        const pipeImage = resourceManager.get<HTMLImageElement>("/pipe-green.png")
        if(!pipeImage) return
        //drawing the first pipe
        ctx.save(); // Save the current state
        // moves the context to the center of the first pipe

        ctx.translate(this.x + this.width/2, this.firstPipeHeight/2);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImage, -this.width/2, -this.firstPipeHeight/2, this.width, this.firstPipeHeight);
        ctx.restore(); // Restore to the original state

        // drawing the second pipe
        ctx.drawImage(pipeImage,this.x, DRAW_HEIGHT - this.secondPipeHeight, this.width, this.secondPipeHeight)

    }
    update(dt: number) {
        this.x += this.vx* dt;


    }




}