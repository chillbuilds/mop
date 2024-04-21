let arrowArr = []
let plusArr = []
let hexArr = []
let arrowQtyText;
let plusQtyText;
let hexQtyText;
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