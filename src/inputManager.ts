export type Action = "MOVE_UP" 

export class InputManager{
    private  actions:Action[] = []
    private static instance:InputManager
    
    
    private constructor(){
        window.addEventListener("keydown",(e:KeyboardEvent)=>{
            switch(e.code){
                case "Space":
                    this.addAction("MOVE_UP")
                    break;
                  
            }

        })
        window.addEventListener("keyup",(e:KeyboardEvent)=>{

            switch(e.code){
                case "Space":
                    this.deleteAction("MOVE_UP")
                    break;

            }

        })

    }
    private addAction(action:Action){
        if(this.actions.includes(action)) return    
        this.actions.push(action)

    }
    private deleteAction(action:Action){
        const index =this.actions.indexOf(action)
        this.actions.splice(index,1)

    }
    public static getInstance():InputManager{
        if(this.instance) return this.instance; 
        this.instance = new InputManager();
        return this.instance
    }


    public getAction(){
        if(this.actions.length === 0) return null
        return this.actions[0]
    }


}