import { IGameEntity } from "./interfaces/IGameEntity";

export class ScoreLabel implements IGameEntity {
  private score: number = 0;
  private highScore: number = 0;
  private fontFamily: string = "Courier, monospace";
  private fontSize: number = 36;
  private fontColor: string = "white";
  private fontStrokeColor: string = "black";
  private fontStrokeWidth: number = 5;
  private position: { x: number; y: number };
  
  constructor(position: { x: number; y: number }) {
    this.position = position;
    
    // Try to load high score from localStorage
    const savedHighScore = localStorage.getItem('flappyBirdHighScore');
    if (savedHighScore) {
      this.highScore = parseInt(savedHighScore, 10);
    }
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    // Configure text style
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = "center";
    
    // Draw score with stroke effect (for better visibility)
    ctx.strokeStyle = this.fontStrokeColor;
    ctx.lineWidth = this.fontStrokeWidth;
    ctx.strokeText(`${this.score}`, this.position.x, this.position.y);
    
    // Draw the actual score text
    ctx.fillStyle = this.fontColor;
    ctx.fillText(`${this.score}`, this.position.x, this.position.y);
  }
  
  update(): void {
    // Nothing to update per frame for the score label itself
    // Score updates are handled externally
  }
  
  incrementScore(): void {
    this.score += 1;
    
    // Update high score if needed
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('flappyBirdHighScore', this.highScore.toString());
    }
  }
  
  resetScore(): void {
    this.score = 0;
  }
  
  getScore(): number {
    return this.score;
  }
  
  getHighScore(): number {
    return this.highScore;
  }
} 