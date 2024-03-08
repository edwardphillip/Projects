import { useEffect } from "react"

export default function SuperRender({scene,animate}){
    const runAnimate = timesincelastframe =>{
        window.requestAnimationFrame(runAnimate)
        animate(timesincelastframe)
        scene.run()
    }
    useEffect(() => {
        if (scene.gl) {
            runAnimate(0)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animate,scene.gl])
    useEffect(()=>{
        if (!scene.initialized) {
            scene.init()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return(
        <main id="SuperGroupMegaExtremeCanvasLocationOfEpicNessAndUniqueNess">
            <canvas width={scene.width} height={scene.height} ref={scene.canvasRef} >
                Your favorite update-your-browser message here.
            </canvas>
        </main>
    )
}