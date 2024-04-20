let unitArr = []

window.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById('mopCanvas')
    canvas.focus()
    let engine = new BABYLON.Engine(canvas, true)

    let repositionToZero = (obj) => {
        obj.scaling = new BABYLON.Vector3(-0.1, 0.1, 0.1)
        obj.rotation.x = BABYLON.Tools.ToRadians(90)
        obj.rotation.z = BABYLON.Tools.ToRadians(180)
        obj.position.y += 10
    }

    function createScene() {
        let scene = new BABYLON.Scene(engine)

        let duplicateUnit = (unit) => {
            for (var i = 0; i < 50; i++) {
                var duplicatedMesh = unit.clone()
                duplicatedMesh.name = "unit_" + i
            
                // Adjust the position, rotation, or scale of each duplicated mesh if needed
                // For example, you can randomly position the duplicated meshes
                duplicatedMesh.position.x = Math.random() * 10 - 5 // Example: Random position between -5 and 5 along the x-axis
                // duplicatedMesh.position.y = Math.random() * 10 - 5 // Example: Random position between -5 and 5 along the y-axis
                // duplicatedMesh.position.z = Math.random() * 10 - 5 // Example: Random position between -5 and 5 along the z-axis
            
                unitArr.push(duplicatedMesh)
                // Add each duplicated mesh to the scene
                scene.addMesh(duplicatedMesh)
            }
            console.log(unitArr)
        }

        // scene.createDefaultEnvironment({
        //     environmentTexture: '../assets/env/environment.env',
        //     createSkybox: false,
        // })

        scene.clearColor = new BABYLON.Color3(0.494, 0.698, 0.882)

        let camera = new BABYLON.ArcRotateCamera("arcCamera1",
            BABYLON.Tools.ToRadians(0),
            BABYLON.Tools.ToRadians(0),
            20.0, new BABYLON.Vector3(0, 20, -25), scene)
        
        // camera.attachControl(canvas, true)

        let glassPBR = new BABYLON.PBRMaterial("glassPBR", scene);
        glassPBR.baseColor = new BABYLON.Color3(0.5, 0.3, 0.1); // Light gray base color
        glassPBR.metallic = 0; // Non-metallic material
        glassPBR.roughness = 0.2; // Slightly rough surface
        glassPBR.alpha = 0.4; // Partially transparent
        glassPBR.indexOfRefraction = 1.5; // Refraction index of glass (typical value)
        glassPBR.directIntensity = 0.5; // Intensity of direct lighting
        glassPBR.environmentIntensity = 0.5; // Intensity of environment (reflection) lighting
        glassPBR.cameraExposure = 0.6; // Camera exposure
        glassPBR.cameraContrast = 1.6; // Camera contrast

        BABYLON.SceneLoader.ImportMeshAsync('arrow', '../assets/models/', 'arrow.obj').then((result)=>{
            let arrow = result.meshes[0]
            arrow.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5)
            arrow.rotation.x = BABYLON.Tools.ToRadians(90)
            arrow.rotation.z = BABYLON.Tools.ToRadians(180)
            arrow.position.y += 10
            arrow.material = glassPBR
            duplicateUnit(arrow)
        })

        // let tablePBR = new BABYLON.PBRMaterial("woodMaterial", scene)
        // tablePBR.albedoTexture = new BABYLON.Texture('../assets/textures/wood/color.jpg', scene)
        // tablePBR.albedoTexture.uScale = .1
        // tablePBR.albedoTexture.vScale = .1
        // tablePBR.albedoTexture.level = 1.5
        // tablePBR.microSurfaceTexture = new BABYLON.Texture('../assets/textures/wood/roughness.jpg', scene)
        // tablePBR.microSurfaceTexture.uScale = .1
        // tablePBR.microSurfaceTexture.vScale = .1
        // tablePBR.bumpTexture = new BABYLON.Texture('../assets/textures/wood/normal.png', scene)
        // tablePBR.bumpTexture.uScale = .1
        // tablePBR.bumpTexture.vScale = .1
        // tablePBR.roughness = 0.9
        // tablePBR.metallic = 0.0

        // BABYLON.SceneLoader.ImportMeshAsync('table', '../assets/models/', 'table.obj').then((result)=>{
        //     let table = result.meshes[0]
        //     repositionToZero(table)
        //     table.material = tablePBR
        // })

        return scene
    }

    let scene = createScene()

    let animateUnits = () => {
        unitArr.forEach(unit => {
            unit.position.z -= Math.floor(Math.random() * 5) + 1
        })
    }

    let moveUnitsLeft = () => {
        unitArr.forEach(unit => {
            unit.position.z -= 1
        })
    }

    let moveUnitsRight = () => {
        unitArr.forEach(unit => {
            unit.position.z += 1
        })
    }

    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
          case BABYLON.KeyboardEventTypes.KEYDOWN:
            if(kbInfo.event.key == ' '){
                animateUnits()
            }
            if(kbInfo.event.key == 'a'){
                moveUnitsLeft()
            }
            if(kbInfo.event.key == 'd'){
                moveUnitsRight()
            }
            console.log("KEY DOWN: ", kbInfo.event.key)
            break
          case BABYLON.KeyboardEventTypes.KEYUP:
            console.log("KEY UP: ", kbInfo.event.code)
            break
        }
      })

    engine.runRenderLoop(function(){
        scene.render()
    })
})