let arrowArr = []
let plusArr = []
let hexArr = []
let maxUnits = 60
let unitsLoaded = false

let xQty = 5
let yQty = 3
let squareMatrix = []
let playerBase = {arrowQty: 4, plusQty: 2, hexQty: 2}

let playerBaseSetup = () => {
    let arrowUnits = []
    let plusUnits = []       
    let hexUnits = []
    let units = [arrowUnits, plusUnits, hexUnits]
    for(var i = 0; i < playerBase.arrowQty; i++){
        arrowArr.forEach(arrow => {
            if(arrow.inUse == false && arrowUnits.length < playerBase.arrowQty){
                arrow.inUse = true
                arrowUnits.push(arrow)
            }
        })
    }
    for(var i = 0; i < playerBase.plusQty; i++){
        plusArr.forEach(plus => {
            if(plus.inUse == false && plusUnits.length < playerBase.plusQty){
                plus.inUse = true
                plusUnits.push(plus)
            }
        })
    }
    for(var i = 0; i < playerBase.hexQty; i++){
        hexArr.forEach(hex => {
            if(hex.inUse == false && hexUnits.length < playerBase.hexQty){
                hex.inUse = true
                hexUnits.push(hex)
            }
        })
    }

    // populate base
    arrowUnits.forEach(unit => {
        unit.position.x = -5
        unit.position.y = -5
    })
    plusUnits.forEach(unit => {
        unit.position.x = -5
        unit.position.y = -15
    })
    hexUnits.forEach(unit => {
        unit.position.x = -5
        unit.position.y = -25
    })
}

let moveToSquare = (units, coord) => {
    let destination = squareMatrix[coord.y-1][coord.x-1]
    if(!destination){
        console.log('coordinates provided to moveToSquare() function are out of bounds or invalid')
        return
    }
    if(!destination.occupied){
            destination.occupied = true
            let slot_a_offset = {x: 3, y: 3}
            let slot_b_offset = {x: 3, y: 7}
            let slot_c_offset = {x: 7, y: 3}
            let slot_d_offset = {x: 7, y: 7}
            units[0].position.x = destination.coordOffset.x - slot_a_offset.x
            units[0].position.y = destination.coordOffset.y - slot_a_offset.y
            units[1].position.x = destination.coordOffset.x - slot_b_offset.x
            units[1].position.y = destination.coordOffset.y - slot_b_offset.y
            units[2].position.x = destination.coordOffset.x - slot_c_offset.x
            units[2].position.y = destination.coordOffset.y - slot_c_offset.y
            units[3].position.x = destination.coordOffset.x - slot_d_offset.x
            units[3].position.y = destination.coordOffset.y - slot_d_offset.y
    }else{
        console.log('square occupied')
    }
}

for(var i = 0; i < yQty; i++){
    let boardXStat = []
    for(var j = 0; j < xQty; j++){
        let obj = {
            coord: {x:j+1, y:i+1},
            coordOffset: {x: (j+1)*-10, y: i*-10},
            occupied: false,
            slot_a_occupied: false,
            slot_b_occupied: false,
            slot_c_occupied: false,
            slot_d_occupied: false,
            influenced: false,
        }
        boardXStat.push(obj)
    }
    squareMatrix.push(boardXStat)
}

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

        let glassPBR = new BABYLON.PBRMaterial("glassPBR", scene);
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

        let baseUnitBgMaterial = new BABYLON.PBRMaterial("baseUnitBgMaterial", scene)
        baseUnitBgMaterial.albedoTexture = new BABYLON.Texture('../assets/textures/paper/color.jpg', scene)
        baseUnitBgMaterial.albedoTexture.uScale = .2
        baseUnitBgMaterial.albedoTexture.vScale = .2
        // baseUnitBgMaterial.albedoTexture.level = 0.7
        baseUnitBgMaterial.microSurfaceTexture = new BABYLON.Texture('../assets/textures/paper/roughness.jpg', scene)
        baseUnitBgMaterial.microSurfaceTexture.uScale = .2
        baseUnitBgMaterial.microSurfaceTexture.vScale = .2
        baseUnitBgMaterial.bumpTexture = new BABYLON.Texture('../assets/textures/paper/normal.png', scene)
        baseUnitBgMaterial.bumpTexture.uScale = .2
        baseUnitBgMaterial.bumpTexture.vScale = .2
        baseUnitBgMaterial.roughness = 1

        // setup unit backgrounds
        BABYLON.SceneLoader.ImportMeshAsync('arrow-holder', '../assets/models/', 'arrow-holder.obj').then((result)=>{
            let arrowHolder = result.meshes[0]
            arrowHolder.scaling = new BABYLON.Vector3(.8, .8, .8)
            arrowHolder.rotation.z = BABYLON.Tools.ToRadians(90)
            arrowHolder.position.x = -5
            arrowHolder.position.y = -5
            arrowHolder.material = baseUnitBgMaterial
        })
        BABYLON.SceneLoader.ImportMeshAsync('plus-holder', '../assets/models/', 'plus-holder.obj').then((result)=>{
            let plusHolder = result.meshes[0]
            plusHolder.scaling = new BABYLON.Vector3(.8, .8, .8)
            plusHolder.position.x = -5
            plusHolder.position.y = -15
            plusHolder.material = baseUnitBgMaterial
        })
        BABYLON.SceneLoader.ImportMeshAsync('hex-holder', '../assets/models/', 'hex-holder.obj').then((result)=>{
            let hexHolder = result.meshes[0]
            hexHolder.scaling = new BABYLON.Vector3(.8, .8, .8)
            hexHolder.rotation.z = BABYLON.Tools.ToRadians(90)
            hexHolder.position.x = -5
            hexHolder.position.y = -25
            hexHolder.material = baseUnitBgMaterial
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