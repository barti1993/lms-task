class Lake {

    constructor(){
        this.handleSelect = this.handleSelect.bind(this);
        this.handleFrogJump = this.handleFrogJump.bind(this);
        this.handleReproduce = this.handleReproduce.bind(this);
    }

    selected = [];    
    cells = [];
    gender = ["male", "female"];
    frogsInitialPositions = {
      male:{
          x:0,
          y:0
      },
      female:{
          x:0,
          y:1
      }
    };    
    lakeSize = {
        cols:10,
        rows:6
    };
    jumpLength = {
        male: 3,
        female:2
    };

    generateLake = () => {
        const tbody = document.querySelector("tbody");
        for (let i = 0; i < this.lakeSize.rows; i++) {
          let tr = document.createElement('tr'); 
          for (let j = 0; j < this.lakeSize.cols; j++) {     
            let td  = document.createElement('td');    

            (i === this.frogsInitialPositions.male.x && j === this.frogsInitialPositions.male.y) ? 
                td.appendChild(this.createFrog("male", i, j, "short", "fat")) :                
            (i === this.frogsInitialPositions.female.x && j === this.frogsInitialPositions.female.y) ?
                td.appendChild(this.createFrog("female",i, j, "tall", "slim")) :  td.appendChild(this.createCell(i, j))          
               
            tr.appendChild(td);
            this.cells.push(td)
          }
          tbody.appendChild(tr);
        } 
    }; 


    handleFrogJump = () =>{
        let selectedElements = []
        if ( this.selected.length === 2) {
            this.selected.forEach( x => {            
                let selectedCell = this.cells[this.cells.findIndex(cell => cell.children[0] == x)];
                selectedElements.push(selectedCell);
            })
            if(this.canPerformJump(selectedElements)){
                this.swapCells(selectedElements);
            }else{            
                alert("Can't jump!");
            }
        } else {
            alert('Select frog and empty field to perform a jump!');
        }
    }


    checkFrogsAdjacent = (frog1, frog2) => {
        let frog1PosX = parseInt(frog1.getAttribute("x"));
        let frog1PosY = parseInt(frog1.getAttribute("y"));
        let frog2PosX = parseInt(frog2.getAttribute("x"));
        let frog2PosY= parseInt(frog2.getAttribute("y"));  
        return (
            (Math.abs(frog1PosX - frog2PosX) === 1 && Math.abs(frog1PosY -frog2PosY) === 0) ? true :
            (Math.abs(frog1PosY - frog2PosY) === 1 && Math.abs(frog1PosX -frog2PosX) === 0) ? true :
            ((Math.abs(frog1PosY - frog2PosY)) === 1 && (Math.abs(frog1PosX - frog2PosX)) === 1 ) ? true : false
        )
    }


    handleReproduce = () =>{
        let selectedElements = []
        if ( this.selected.length === 2) {
            this.selected.forEach( x => {            
                let selectedCell = this.cells[this.cells.findIndex(cell => cell.children[0] == x)];
                selectedElements.push(selectedCell);
            })            
            if(this.canReproduce(selectedElements)){
                let mother; 
                selectedElements.forEach( x => {            
                    if(x.childNodes[0].className.split(' ')[1] === "female"){
                        mother = x;
                    }                
                })
                let availableFields = this.cells.filter(this.getEmptyReproduceFields(mother));     
                let fieldToReproduce = availableFields[Math.floor(Math.random() * availableFields.length)];    
                let childToRemove = fieldToReproduce.childNodes[0];
                let childX = childToRemove.getAttribute("x");
                let childY = childToRemove.getAttribute("y");
                fieldToReproduce.removeChild(childToRemove);
                let characteristics = this.inheritSpecifics(selectedElements);
                fieldToReproduce.appendChild(this.createFrog(this.handleRandGender(), childX, childY, characteristics.height, characteristics.weight ));
                this.selected = [];
            }else{
                alert('Cant reproduce!');
            }
        }
    }


    handleRandGender = () => {
        return this.gender[Math.floor(Math.random() * this.gender.length)];
    }


    inheritSpecifics = (selectedElements) => {
        let mother;
        let father;
        selectedElements.forEach( x => {            
            if(x.childNodes[0].className.split(' ')[1] === "female"){
                 mother = x;
            }
            if(x.childNodes[0].className.split(' ')[1] === "male"){
                 father = x;
            }
        })
        let attributeToInherit = ["height", "weight"];
        // First inherit random one from mother
        let attInheritedFromMother = attributeToInherit[Math.floor(Math.random() * attributeToInherit.length)];
        // Then inherit the other one from father
        let attInheritedFromFather = attributeToInherit.filter(elem => {
            return elem != attInheritedFromMother;
        });
    
        attInheritedFromFather = attInheritedFromFather[0];
        let attributes = {
            [attInheritedFromMother] : mother.childNodes[0].getAttribute([attInheritedFromMother]),
            [attInheritedFromFather] : father.childNodes[0].getAttribute([attInheritedFromFather])
        };    
        father.childNodes[0].children[0].checked = false;
        mother.childNodes[0].children[0].checked = false;
        return attributes;
    }

    canReproduce = (selectedElements) => {
        let element1 = selectedElements[0].childNodes[0];
        let gender1 = element1.className.split(' ')[1];
        let element2 = selectedElements[1].childNodes[0];    
        let gender2 = element2.className.split(' ')[1];
        let mother;
        if(this.checkFrogsAdjacent(element1, element2)){
            if(element1.className && element2.className){
                if(gender1 != gender2){
                    selectedElements.forEach( x => {            
                        if(x.childNodes[0].className.split(' ')[1] === "female"){
                            mother = x;
                        }                
                    })
                    let availableFields = this.cells.filter(this.getEmptyReproduceFields(mother));     
                    if(availableFields && availableFields.length > 0){                
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }        
            }else{
                return false;
            }
        }else{
            return false
        }
    }


    getMaxJumpLength = (gender) =>{
        switch(gender){
            //Jump length + current position
            case "male":
            return this.jumpLength.male + 1;     
            case "female":
            return this.jumpLength.female + 1;  
            default:
            break;    
        }        
    }
    
    swapCells = (array) => {
        let tempVal = array[0].childNodes[0];
        let tempVal1 = array[1].childNodes[0];       
        // Swap position attributes
        let tempAttributeX = tempVal.getAttribute("x");
        let tempAttributeY = tempVal.getAttribute("y");
        tempVal.setAttribute("x", tempVal1.getAttribute("x"));
        tempVal.setAttribute("y", tempVal1.getAttribute("y"));
        tempVal1.setAttribute("x", tempAttributeX);
        tempVal1.setAttribute("y", tempAttributeY);
        // Swap elements
        array[0].removeChild(tempVal)
        array[1].removeChild(tempVal1);
        array[0].appendChild(tempVal1)
        array[1].appendChild(tempVal)
        //Remove checkbox tick
        tempVal.children[0].checked = false;
        tempVal1.children[0].checked = false;
        // Clear selected array
        this.selected = [];    
    } 
    
    handleSelect = (lakeField) =>{        
        if(this.selected.length < 2 && lakeField.children[0].checked){       
                this.selected.push(lakeField);                  
        }else{      
            let index = this.selected.indexOf(lakeField)  
            if (index > -1) {
                this.selected.splice(index, 1);
            }
            lakeField.children[0].checked = false
        }    
    }
    
    createFrog = (gender, posX, posY, height, weight) =>{
        let frog = document.createElement('label');
        frog.classList.add("frog");
        frog.setAttribute("height", height);
        frog.setAttribute("weight", weight);
        frog.setAttribute("x", posX);
        frog.setAttribute("y", posY);
        let checkbox = document.createElement('input');    
        checkbox.type = "checkbox";    
        frog.appendChild(checkbox);
        switch(gender){
            case "male":
                frog.classList.add("male");
            break;
            case "female":
                frog.classList.add("female");
            break;
            default:            
        }    
        let _thisFrog = this;
        frog.onclick = function (){
            _thisFrog.handleSelect(frog);
        }
        return frog;
    }
    
    createCell = (posX, posY) =>{
        let cell = document.createElement('label');
        cell.setAttribute("x", posX);
        cell.setAttribute("y", posY);
        let checkbox = document.createElement('input'); 
        checkbox.type = "checkbox";
        
        let _thisCell = this;
        cell.onclick = function (){
            _thisCell.handleSelect(cell);
        }
        cell.appendChild(checkbox);
        return cell;
    }

    getEmptyReproduceFields = (mother) => {
        return function(elem) {
            let posX = elem.childNodes[0].getAttribute("x");
            let posY = elem.childNodes[0].getAttribute("y"); 
            let motherPosX = mother.childNodes[0].getAttribute("x");
            let motherPosY = mother.childNodes[0].getAttribute("y"); 
            if(!elem.childNodes[0].className){
                if(
                   (Math.abs(motherPosX - posX)) === 1 &&
                   (Math.abs(motherPosY - posY)) === 1 ||
                  (((Math.abs(motherPosY - posY)) === 1) && motherPosX===posX) ||
                  (((Math.abs(motherPosX - posX)) === 1) && motherPosY===posY)
                ){
                    return elem;                             
                }            
            }       
        }    
    }    
    
    canPerformJump = (selectedElements) => {
        let element1 = selectedElements[0].childNodes[0];
        let element2 = selectedElements[1].childNodes[0];    
        let jumpLength;
        if(element1.className && element2.className){
            return false;
        }else{   
                jumpLength = element1.className ? this.getMaxJumpLength(element1.className.split(' ')[1]) : this.getMaxJumpLength(element2.className.split(' ')[1]);
                let elem1PosX = parseInt(element1.getAttribute("x"));
                let elem1PosY = parseInt(element1.getAttribute("y"));
                let elem2PosX = parseInt(element2.getAttribute("x"));
                let elem2PosY= parseInt(element2.getAttribute("y"));             
                return (
                    ((Math.abs(elem1PosY - elem2PosY)) < jumpLength && (Math.abs(elem1PosX - elem2PosX)) == 0) ? true :
                    ((Math.abs(elem1PosX - elem2PosX)) < jumpLength && (Math.abs(elem1PosY - elem2PosY)) == 0) ? true :
                    (((Math.abs(elem1PosY - elem2PosY)) < jumpLength && (Math.abs(elem1PosX - elem2PosX)) < jumpLength)) ? true : false               
                )
        }
    }
};


const lake =  new Lake();
lake.generateLake(10,6);
