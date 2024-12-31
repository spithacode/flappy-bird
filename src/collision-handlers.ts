import { Bird } from "./Bird";
import {  DRAW_HEIGHT } from "./main";
import { PipePair } from "./PipePair";

export function isBirdCollidingWithPipes(bird: Bird, pipePairs: PipePair[]) {
    for (const pipe of pipePairs) {
        if (
            // x axis check
            bird.position.x + bird.width >= pipe.x &&
            bird.position.x <= pipe.x + pipe.width &&
            // y axis check
            (bird.position.y  <= pipe.firstPipeHeight ||
            bird.position.y + bird.height >= DRAW_HEIGHT - pipe.secondPipeHeight)
            

        ){
            return {isColliding:true,pipe}

        }


    }
            
    return {isColliding:false,pipe:null}

}

export function isBirdCollidingWithGround(bird: Bird) {
    return bird.position.y + bird.height >= DRAW_HEIGHT;
}