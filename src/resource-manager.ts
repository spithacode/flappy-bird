export class ResourceManager{
    private static instance:ResourceManager;
    public resourceMap = new Map<string,{
        
        asset:HTMLImageElement | HTMLAudioElement,
        isReady?:boolean


    }>()


    private constructor(){
        this.init()

    }

    private  init(){
        try{
             Promise.all([
                this.loadAsset("/background-day.png"),
                this.loadAsset("/bird/downflap.png"),
                this.loadAsset("/bird/midflap.png"),
                this.loadAsset("/bird/upflap.png"),
                this.loadAsset("/pipe-green.png"),
                this.loadAsset("/base.png"),
                this.loadAsset("/audio/die.wav"),
                this.loadAsset("/audio/hit.wav"),
                this.loadAsset("/audio/point.wav")])
    }catch(err){
        console.error(err)

    }
    }

    public static getInstance():ResourceManager{
        if(!this.instance){
            this.instance = new ResourceManager();
            return this.instance

        }
        return this.instance
    }
    public get<T extends HTMLAudioElement | HTMLImageElement>(src:string):T | null{
        const resource = this.resourceMap.get(src)
        if(!resource?.isReady ){
            return null

        }
        return resource?.asset as T
    }

    private getAssetObjectFromSrc(src:string){

        let asset:HTMLImageElement | HTMLAudioElement;
        if(src.endsWith(".wav")){
            asset = new Audio()



        }else{
            asset = new Image()
        }
        return asset

    }

    private loadAsset(src:string){
        return new Promise<HTMLImageElement | HTMLAudioElement>((resolve,reject)=>{


        const asset = this.getAssetObjectFromSrc(src)

        this.resourceMap.set(src,{asset,isReady:false})

        asset.src = src

        asset.onload = ()=>{
            console.log("Loaded resource",src)
            resolve(asset)
            this.resourceMap.set(src,{asset,isReady:true})

        }
        if(asset instanceof HTMLAudioElement){
            asset.oncanplay = ()=>{
                console.log("Loaded resource",src)
                resolve(asset)
                this.resourceMap.set(src,{asset,isReady:true})

            }
        }

        asset.onerror = (error)=>{
            console.error("Failed to load resource",src)
            console.error(error)
            reject(error)
        }

        })
    }
    public areAllResourcesReady():boolean{
        return Array.from(this.resourceMap.values()).every((value)=>value.isReady)
    }


}