document.getElementById('gradPlanModalBtn').addEventListener('click', function(event) {
    event.preventDefault(); //Page would refresh when clicking the modal for some reason
    gradPlan = []; //Resets Grad Plan
    const numberOfSemesters = document.getElementById("semesters").value; //Getting the user Inputs
    const numberClassesPerSemester = document.getElementById("csClasses").value;

    if(!numberOfSemesters) {
        alert("Enter your Preferred number of semesters until graduation");
        return;
    } else if(!numberClassesPerSemester) {
        alert("Enter your Max number of classes per semester");
        return;
    } else if(numberOfSemesters < 1 || numberOfSemesters > 7) {
        alert("Invalid Graduation Preferences:\nPlease enter a number of semesters between 1 and 7.");
        return;
    } else if(numberClassesPerSemester < 2 || numberClassesPerSemester > 3) {
        alert("Invalid Graduation Preferences:\nPlease enter a number of CS Classes between 2 and 3.");
        return;
    }

    getClassesLeft(numberOfSemesters, numberClassesPerSemester);
});


//Gets the amount of classes needed to graduation 
function getClassesLeft(numberOfSemesters, numberClassesPerSemester) {
    //Each Graduation Requirement
    let systemElectiveReq= 1;
    let algorithimElectiveReq = 1;
    let totalClassCount = 17;
    let classesLeft = requiredClasses;
    let electiveCount = 0;

    //Calculating the amount of Classes Needed for each Requirement
    for(let i = 0; i < completedClasses.length; i++) {
        if (classesLeft.includes(completedClasses[i])) { //Required CS classes
            totalClassCount--;
            classesLeft = classesLeft.filter(className => className !== completedClasses[i]);;
        } 
        else if(systemsElectives.includes(completedClasses[i]) && systemsElectives != 0) { // System Electives
            systemElectiveReq--;
            totalClassCount--;
            classesLeft = classesLeft.filter(className => className !== `Systems Elective`);;
        } 
        else if(algorithimElective.includes(completedClasses[i]) && algorithimElective != 0) { // Algorithim Electives
            algorithimElectiveReq--;
            totalClassCount--;
            classesLeft = classesLeft.filter(className => className !== "Algorithim Elective");;
        } 
        else if(electiveCount < 3 ) { // Normal Electives
            electiveCount++;
            totalClassCount--;
            classesLeft = classesLeft.filter(className => className !== `Elective${electiveCount}`);;
        } else {
            console.log("Excess Class");
        }
    }
    calculatePlan(numberOfSemesters, numberClassesPerSemester, classesLeft, completedClasses);
    return classesLeft;
}   

//Calculates Base Graduation Plan
function calculatePlan(numberOfSemesters, numberClassesPerSemester, classesLeft, completedClasses) {
    let classesLeftByPriority = [];

    for (let i = 0; i < ClassPriority.length; i++) { //Sorting classes by Priority
        let cls = ClassPriority[i];
        if (classesLeft.includes(cls)) {
            classesLeftByPriority.push(cls);
        }
    }

    let i = 0;
    let maxDifficulty = getMaxDifficulty(numberClassesPerSemester);

    while(i < classesLeftByPriority.length) { //Create a plan for each semester
        let semesterPlan = []; //Reset semester array
        let semesterDifficulty = 0;

        //Making sure each table doesnt - Excede Max Difficulty, Excede Max Classes Per semester
        while (semesterDifficulty + classDifficulty.get(classesLeftByPriority[i]) < maxDifficulty && semesterPlan.length < numberClassesPerSemester && i < classesLeftByPriority.length) {
            let currentClass = classesLeftByPriority[i];
            let classDif = classDifficulty.get(currentClass); //Get difficulty of current class
            
            
            semesterPlan.push(currentClass);
            semesterDifficulty += classDif;  
            i++;
        }
        gradPlan.push(semesterPlan); //Add Semester array to gradplan
    }

    if (gradPlan.length < numberOfSemesters) { //Spread Out classes if preferred semesters has not been reached
        gradPlan = balancePlan(gradPlan, numberOfSemesters);
    }

    rebuildForPrerequisites(gradPlan, numberOfSemesters);
}

//Small helper function for creating semesters
function getMaxDifficulty(numberClassesPerSemester) { 
    if(numberClassesPerSemester == 2) {
        return numberClassesPerSemester * 10;
    } 
    else if(numberClassesPerSemester == 3) {
        return numberClassesPerSemester * 8.5;
    } 
}


//Balances out the graduation plan so they are distributed evenly
function balancePlan(gradPlan, numberOfSemesters) { 

    let allClasses = []; //Copy orginal gradPlan into this
    for (let i = 0; i < gradPlan.length; i++) {
        for (let j = 0; j < gradPlan[i].length; j++) {
            allClasses.push(gradPlan[i][j]);
        }
    }
    
    //Determine number of classes per semester
    const totalClasses = allClasses.length;
    const baseClassNumber = Math.floor(totalClasses / numberOfSemesters); 
    let extraClasses = totalClasses % numberOfSemesters;

    let balancedPlan = [];
    let classIndex = 0;

    //Distributing classes evenly across semesters
    for (let i = 0; i < numberOfSemesters; i++) {
        //If extra is greater than 0 assign an extra class to the current semester
        
        let semesterSize = baseClassNumber; 
        if(extraClasses > 0) {
            semesterSize++;
        }
        extraClasses--;


        //adding the classes to the semester
        let semester = [];
        for (let j = 0; j < semesterSize; j++) {
            semester.push(allClasses[classIndex]);
            classIndex++;
        }
        balancedPlan.push(semester);
    }

    return balancedPlan;
}

//Makes sure Prerequisites have been met for each class in each semeseter
function rebuildForPrerequisites(gradPlan, numberOfSemesters) {
    console.log(gradPlan);
    for (let i = 0; i < gradPlan.length; i++) {
        for (let x = 0; x < gradPlan[i].length; x++) {
            let classRow = gradPlan[i];
            let className = gradPlan[i][x];
            //convert Electives into an actualy class to check for prereqs
            if (className == "Systems Elective") {
                className = "CS455";
            }
            if (className == "Algorithim Elective") {
                className = "CS452" 
            }
            if (className == "Elective1" || className == "Elective2" || className == "Elective3") {
                className = "CS449"; //random elective
            }
            let prerequisites = AllClasses.get(className).prereqs;

            for (let y = 0; y < prerequisites.length; y++) { //Check if a prerequisite for a class is on the same row
                if (classRow.includes(prerequisites[y])) {
                    gradPlan[i].splice(x, 1); // Remove the class
                    x--;
                    if (gradPlan[i + 1] && gradPlan[i + 1].length < 3) {
                        gradPlan[i + 1].push(className);
                        balancePlan(gradPlan, numberOfSemesters) //Rebalance the grad plan
                    }
                    else { //create a new row shift all other rows down
                        gradPlan.splice(i + 1, 0, [className]);
                    }
                }
            }
        }
    }
    buildGradPlanTable(gradPlan);
}

// Building Graduation Plan Modal
function buildGradPlanTable(gradPlan) { 
    const tbody = document.querySelector("#planModal tbody"); 
    tbody.innerHTML = ""; 

    document.getElementById("semesterNumber").textContent = gradPlan.length;

    for (let i = 0; i < gradPlan.length; i++) {
        const semester = gradPlan[i];
        const row = document.createElement("tr"); //Create a new row for each new semester

        const semNum = document.createElement("th"); //Creates a table header for semester #
        semNum.scope = "row";
        semNum.textContent = i + 1; 
        row.appendChild(semNum); // adds the semester number to the header

        for (let j = 0; j < 3; j++) { 
            const classNumberSquare = document.createElement("td");
            classNumberSquare.textContent = semester[j] || "—"; // Null spot on the table gets a "-"
            row.appendChild(classNumberSquare);
        }

        tbody.appendChild(row); 
    }
    $('#planModal').modal('show');
}