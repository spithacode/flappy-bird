export class ScoreManager {
  private static instance: ScoreManager;
  private score: number = 0;
  private highScore: number = 0;

  private constructor() {
    // Try to load high score from localStorage if available
    const savedHighScore = localStorage.getItem('flappyBirdHighScore');
    if (savedHighScore) {
      this.highScore = parseInt(savedHighScore, 10);
    }
  }

  public static getInstance(): ScoreManager {
    if (!this.instance) {
      this.instance = new ScoreManager();
    }
    return this.instance;
  }

  public getScore(): number {
    return this.score;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  public incrementScore(): void {
    this.score++;
    
    // Update high score if current score is higher
    if (this.score > this.highScore) {
      this.highScore = this.score;
      // Save to localStorage if available
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('flappyBirdHighScore', this.highScore.toString());
      }
    }
  }

  public reset(): void {
    this.score = 0;
  }
} 