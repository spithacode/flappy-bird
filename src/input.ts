import   {InputManager} from "@spithacode/input-manager";
console.log(InputManager)

// This will be initialized in main.ts
export let inputManager: InputManager;

// Function to initialize the InputManager with the canvas
export function initializeInputManager(canvas: HTMLCanvasElement): void {
if(inputManager) return 
  inputManager = new InputManager(canvas);
} 