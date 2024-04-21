window.addEventListener("DOMContentLoaded", function() {

    let canvas = document.getElementById('mopCanvas')
    let engine = new BABYLON.Engine(canvas, true)

    console.log('building scene..')

    let removeFromStage = (obj) => {
        obj.position.x = -200
    }

    function createScene() {
        let scene = new BABYLON.Scene(engine)

        let createUnits = (unit, qty) => {
            for (var i = 0; i < qty; i++) {
                var duplicatedMesh = unit.clone()
                duplicatedMesh.name = "unit_" + i
            
                duplicatedMesh.position.x = -1000 // Example: Random position between -5 and 5 along the x-axis
                
                switch(unit.name) {
                    case 'arrow':
                        duplicatedMesh.inUse = false
                        arrowArr.push(duplicatedMesh)
                        break
                    case 'hex':
                        duplicatedMesh.inUse = false
                        hexArr.push(duplicatedMesh)
                        break
                    case 'plus':
                        duplicatedMesh.inUse = false
                        plusArr.push(duplicatedMesh)
                        break
                    default:
                      console.log('unrecognizes unit.name in createUnits() function\nunit.name: ' + unit.name)
                  }
                // Add each duplicated mesh to the scene
                scene.addMesh(duplicatedMesh)
            }
        }

        scene.createDefaultEnvironment({
            environmentTexture: '../assets/env/environment.env',
            createSkybox: false,
        })

        scene.clearColor = new BABYLON.Color3(0.494, 0.698, 0.882)

        var camera = new BABYLON.ArcRotateCamera("arcCamera", Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene)
        // back up camera
        camera.radius += 38
        // pan left
        camera.target.x = -35
        camera.target.y = -15
        camera.attachControl(canvas, true)

        let glassPBR = new BABYLON.PBRMaterial("glassPBR", scene)
        glassPBR.baseColor = new BABYLON.Color3(0.5, 0.3, 0.1); // Light gray base color
        glassPBR.metallic = .5; // Non-metallic material
        glassPBR.roughness = 0.2; // Slightly rough surface
        glassPBR.alpha = 0.5; // Partially transparent
        glassPBR.indexOfRefraction = 1.5; // Refraction index of glass (typical value)
        glassPBR.directIntensity = 0.5; // Intensity of direct lighting
        glassPBR.environmentIntensity = 0.5; // Intensity of environment (reflection) lighting
        glassPBR.cameraExposure = 0.6; // Camera exposure
        glassPBR.cameraContrast = 1.6; // Camera contrast

        BABYLON.SceneLoader.ImportMeshAsync('arrow', '../assets/models/', 'arrow.obj').then((result)=>{
            let arrow = result.meshes[0]
            arrow.scaling = new BABYLON.Vector3(.8, .8, .8)
            arrow.rotation.z = BABYLON.Tools.ToRadians(90)
            arrow.position.x = 0
            arrow.position.y = 0
            arrow.material = glassPBR
            removeFromStage(arrow)
            createUnits(arrow, maxUnits)
        })

        BABYLON.SceneLoader.ImportMeshAsync('hex', '../assets/models/', 'hex.obj').then((result)=>{
            let hex = result.meshes[0]
            hex.scaling = new BABYLON.Vector3(.8, .8, .8)
            hex.rotation.z = BABYLON.Tools.ToRadians(90)
            hex.position.x = 0
            hex.position.y = 0
            hex.material = glassPBR
            removeFromStage(hex)
            createUnits(hex, maxUnits)
        })

        BABYLON.SceneLoader.ImportMeshAsync('plus', '../assets/models/', 'plus.obj').then((result)=>{
            let plus = result.meshes[0]
            plus.scaling = new BABYLON.Vector3(.8, .8, .8)
            plus.position.x = 0
            plus.position.y = 0
            plus.material = glassPBR
            removeFromStage(plus)
            createUnits(plus, maxUnits)
        })

        let groundPBR = new BABYLON.PBRMaterial("groundPBR", scene)
        groundPBR.albedoTexture = new BABYLON.Texture('../assets/textures/black-plastic/color.jpg', scene)
        groundPBR.albedoTexture.uScale = 1
        groundPBR.albedoTexture.vScale = .6
        groundPBR.albedoTexture.level = 1.5
        groundPBR.microSurfaceTexture = new BABYLON.Texture('../assets/textures/black-plastic/roughness.jpg', scene)
        groundPBR.microSurfaceTexture.uScale = 1
        groundPBR.microSurfaceTexture.vScale = .6
        groundPBR.bumpTexture = new BABYLON.Texture('../assets/textures/black-plastic/normal.png', scene)
        groundPBR.bumpTexture.uScale = 1
        groundPBR.bumpTexture.vScale = .6
        groundPBR.roughness = 1

        let basePBR = new BABYLON.PBRMaterial("basePBR", scene)
        basePBR.albedoTexture = new BABYLON.Texture('../assets/textures/black-plastic/color.jpg', scene)
        basePBR.albedoTexture.uScale = .2
        basePBR.albedoTexture.vScale = .2
        basePBR.albedoTexture.level = 1.5
        basePBR.microSurfaceTexture = new BABYLON.Texture('../assets/textures/black-plastic/roughness.jpg', scene)
        basePBR.microSurfaceTexture.uScale = .2
        basePBR.microSurfaceTexture.vScale = .2
        basePBR.bumpTexture = new BABYLON.Texture('../assets/textures/black-plastic/normal.png', scene)
        basePBR.bumpTexture.uScale = .2
        basePBR.bumpTexture.vScale = .2
        basePBR.roughness = 1

        let ground = BABYLON.MeshBuilder.CreateBox("ground", {width: 50, height: 30}, scene)
        ground.material = groundPBR
        ground.position.x = -35
        ground.position.y += -15
        ground.position.z = -.5

        let baseLeft = BABYLON.MeshBuilder.CreateBox("baseLeft", {width: 10, height: 30}, scene)
        baseLeft.material = basePBR
        baseLeft.position.x = -5
        baseLeft.position.y += -15
        baseLeft.position.z = -.5

        let baseRight = BABYLON.MeshBuilder.CreateBox("baseRight", {width: 10, height: 30}, scene)
        baseRight.material = basePBR
        baseRight.position.x = -65
        baseRight.position.y += -15
        baseRight.position.z = -.5

        // setup unit backgrounds
        BABYLON.SceneLoader.ImportMeshAsync('arrow-holder', '../assets/models/', 'arrow-holder.obj').then((result)=>{
            let arrowHolder = result.meshes[0]
            arrowHolder.scaling = new BABYLON.Vector3(.8, .8, .8)
            arrowHolder.rotation.z = BABYLON.Tools.ToRadians(90)
            arrowHolder.position.x = -5
            arrowHolder.position.y = -5
            arrowHolder.material = glassPBR
        })
        BABYLON.SceneLoader.ImportMeshAsync('plus-holder', '../assets/models/', 'plus-holder.obj').then((result)=>{
            let plusHolder = result.meshes[0]
            plusHolder.scaling = new BABYLON.Vector3(.8, .8, .8)
            plusHolder.position.x = -5
            plusHolder.position.y = -15
            plusHolder.material = glassPBR
        })
        BABYLON.SceneLoader.ImportMeshAsync('hex-holder', '../assets/models/', 'hex-holder.obj').then((result)=>{
            let hexHolder = result.meshes[0]
            hexHolder.scaling = new BABYLON.Vector3(.8, .8, .8)
            hexHolder.rotation.z = BABYLON.Tools.ToRadians(90)
            hexHolder.position.x = -5
            hexHolder.position.y = -25
            hexHolder.material = glassPBR
        })

        return scene
    }

    let scene = createScene()

    let loadedInterval = setInterval(()=>{
        if(plusArr.length == maxUnits && arrowArr.length == maxUnits && hexArr.length == maxUnits && unitsLoaded == false){
            clearInterval(loadedInterval)
            unitsLoaded = true
            console.log('units loaded')
            console.log('setting up demo')
            playerBaseSetup()
        }
    },100)

    engine.runRenderLoop(function(){
        scene.render()
    })
})