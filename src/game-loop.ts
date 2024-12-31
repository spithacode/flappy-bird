export class GameLoop {
    private lastRequestId?: number;
    private isRunning: boolean = false;
    public lastTimestamp: number = 0;
    private deltaTime: number = 0;
    private accumulator: number = 0;
    public gameStartTime: number = 0;

    // FPS settings
    private readonly DEFAULT_FPS = 60;
    private readonly MIN_FPS = 20;
    private readonly MAX_FPS = 144;
    private targetFps: number = this.DEFAULT_FPS;

    private static instance: GameLoop;

    private constructor() { }

    public static getInstance(): GameLoop {
        if (!this.instance) {
            this.instance = new GameLoop();
        }
        return this.instance;
    }
    public get time(): number {
        return this.lastTimestamp - this.gameStartTime

    }

    private get targetFrameTime(): number {
        return 1000 / this.targetFps;
    }

    private get maxDeltaTime(): number {
        return 1000 / this.MIN_FPS; // Cap at minimum FPS (e.g., 50ms at 20 FPS)
    }

    private calculateDeltaTime(timestamp: number): number {
        const deltaTime = timestamp - this.lastTimestamp; // the time takes to render a single frame in milliseconds this.lastTimestamp = timestamp;
        this.lastTimestamp = timestamp;
        return Math.min(deltaTime, this.maxDeltaTime);
    }

    // The fixed timestep pattern
    private updateGameLogic(update: (dt: number) => void) {

        this.accumulator += this.deltaTime;

        // Prevent spiral of death by limiting accumulated time
        // Slow device -> surprizingly high deltaTime -> high accumulator -> many updates -> spiral of death
        // delta time = 1000ms ---> 50 ms to prevent the spiral of death
        if (this.accumulator > this.maxDeltaTime) {

            this.accumulator = this.maxDeltaTime;
        }


        // accumulator = 50ms --> 20 fps --> slow device
        // targetFrameTime = 16.67ms
        // 50ms / 16.67ms = 3 updates in 1 frame --> flow device

        // accumulator = 8ms --> 120 fps-> fast device
        // targetFrameTime = 16.67ms
        // 8ms / 16.67ms = 1 updates in 2 frame 

        //--------> result is: the game physics runs at 60 updates/sec --> 60 fps on both devices


        // The accumulator ensure taking into account all the time that has passed since the last update
        // iteration or frame 0:
        // initial deltatime = 20ms
        // target frame time = 16.67ms --> 60 fps(updates/sec)
        //accumulator = 20ms , number of updates = 20ms/16.67ms = 1
        // accumulator = 3.33ms

        //iteration or frame 1:
        // deltatime = 14ms
        // accumulator = 14ms + 3.33ms =  17.33ms
        // number of updates = 17.33ms/16.67ms = 1
        // accumulator = 0.67ms





        const NumberOfUpdates = Math.floor(this.accumulator / this.targetFrameTime);
        for (let i = 0; i < NumberOfUpdates; i++) {
            update(this.targetFrameTime / 1000);
            this.accumulator -= this.targetFrameTime;
        }
    }

    public start(update: (dt: number) => void, render: () => void) {
        this.isRunning = true;
        this.lastTimestamp = performance.now();
        this.gameStartTime = this.lastTimestamp

        const loop = (timestamp: number) => {
            if (!this.isRunning) return;

            // Always request next frame first
            this.lastRequestId = requestAnimationFrame(loop);


            this.deltaTime = this.calculateDeltaTime(timestamp);
            this.updateGameLogic(update); // ensures that the update method is called at a fixed interval({targetFps} updates/sec)
            render();

        };

        requestAnimationFrame(loop);
    }

    public stop() {
        if (!this.lastRequestId) return;
        this.isRunning = false;
        cancelAnimationFrame(this.lastRequestId);
        this.lastRequestId = undefined;
        this.gameStartTime = 0
    }

    setTargetFPS(fps: number) {
        this.targetFps = Math.min(Math.max(fps, this.MIN_FPS), this.MAX_FPS);
    }

}

/*
GameLoop Explanation:

1. Core Concepts:
   - Uses requestAnimationFrame for smooth animation
   - Implements fixed timestep updates for consistent game logic
   - Separates rendering from updates for stability

2. Time Management:
   - deltaTime: Time between frames (capped at maxDeltaTime to prevent spiral of death)
   - accumulator: Stores leftover time between updates
   - targetFrameTime: How long each update step should be (e.g., 16.67ms at 60 FPS)

3. How It Works:
   Step 1: Request next frame
   Step 2: Calculate deltaTime (timestamp - lastTimestamp)
   Step 3: Update game logic in fixed steps while accumulator >= targetFrameTime
   Step 4: Render the game state

4. Fixed Timestep Pattern:
   Example at 60 FPS (targetFrameTime = 16.67ms):
   Frame 1: deltaTime = 20ms
   - accumulator = 20ms
   - Run update once (16.67ms)
   - accumulator = 3.33ms leftover

   Frame 2: deltaTime = 18ms
   - accumulator = 21.33ms (3.33 + 18)
   - Run update once (16.67ms)
   - accumulator = 4.66ms leftover

5. Benefits:
   - Predictable physics/game logic
   - Smooth animation
   - Handles performance drops gracefully
   - Prevents spiral of death (infinite update loops)

6. Updates vs Renders Relationship:
   The number of updates and renders can be different in a single frame:

   Case 1 - Fast Device (Running at 120 FPS):
   - deltaTime = 8.33ms (1000/120)
   - targetFrameTime = 16.67ms (1000/60)
   - Result: One render might have 0 updates because accumulator (8.33ms) < targetFrameTime (16.67ms)
   
   Case 2 - Slow Device (Running at 30 FPS):
   - deltaTime = 33.33ms (1000/30)
   - targetFrameTime = 16.67ms (1000/60)
   - Result: One render will have 2 updates because accumulator (33.33ms) / targetFrameTime (16.67ms) = 2

   This decoupling ensures:
   - Game logic (physics, collisions) runs at fixed intervals (60 updates/sec)
   - Rendering adapts to device performance (can be faster or slower)
   - Game speed remains consistent regardless of frame rate
*/