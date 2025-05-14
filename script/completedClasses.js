//Builds JMU CS Classes Table
function buildClassTable() { 
    document.getElementById("classListBody").innerHTML = "";

    const classNumbers = Array.from(AllClasses.keys());

    for (let i = 0; i < classNumbers.length; i++) {
        const classNumber = classNumbers[i];

        if (completedClasses.includes(classNumber)) { //Skips over the class if it has already ben added
            continue;
        }

        //Getting the HTML row template for the modal
        const row = document.getElementById("classRowTemplate").content.cloneNode(true);
        row.querySelector("th").textContent = classNumber; 
        row.querySelector("td").textContent = AllClasses.get(classNumber).name;

        //Adds a listener/function that adds the class to the completed class list.
        row.querySelector("#addClass").addEventListener('click', function() {
            if (completedClasses.length + 1 > 19) {
                alert("You cannot have more than 19 Classes");
                return;
            }

            //Making Sure that user has added the classes prerequisites before adding the class.
            const prerequisites = AllClasses.get(classNumber).prereqs;
            let flag = false;
            for (let i = 0; i < prerequisites.length; i++) {
                if (!completedClasses.includes(prerequisites[i])) {
                    flag = true;
                }
            }

            if(flag == true) {
                alert(`Ensure you have added all Prerequisites for ${classNumber} : ${prerequisites}`)
            } else {
                completedClasses.push(classNumber);
                localStorage.setItem("completedClasses", JSON.stringify(completedClasses)); 
                buildClassTable();
                updateList();
            }
        });
        document.getElementById("classListBody").appendChild(row);
    }
}

//Updates Completed Class List
function updateList() { 
    const completedClassList = document.getElementById("completedClassList");
    completedClassList.innerHTML = "";

    //Loop through all classes in the completed classes array
    for (let i = 0; i < completedClasses.length; i++) {
        const classNumber = completedClasses[i];
        const classData = AllClasses.get(classNumber);

        //Getting the HTML row template for the list
        const completedClassRow = document.getElementById("completedClassTemplate").content.cloneNode(true);
        completedClassRow.querySelector("p").textContent = `${classNumber} | ${classData.name}`;
        const removeButton = completedClassRow.querySelector("button").id = `remove-${classNumber}`;
        removeButton.id = `remove-${classNumber}`;

        if (classNumber == "CS149") { //Doesnt allow CS149 To be removed
            removeButton.disabled = true;
            completedClassRow.querySelector("button").addEventListener('click', function() {
                alert("Cannot Remove CS149 due to it being a prerequisite for all other classes.")
            });
        }
        else {
            //adds a listener/function that removes the class being clicked.
            completedClassRow.querySelector("button").addEventListener('click', function() {
            const dependentClasses = getDependentClasses(classNumber);
            if (dependentClasses.length > 0) {
                alert(`You must remove these classes first because they depend on ${classNumber} : ${dependentClasses.join(", ")}`);
                return;
            }
            //Creating a new array of completed classes without the class that being removed
            let updatedClasses = [];
            for (let i = 0; i < completedClasses.length; i++) {
                const c = completedClasses[i];
                if (c != classNumber) {
                    updatedClasses.push(c);
                }
            }

            completedClasses = updatedClasses; 
            localStorage.setItem("completedClasses", JSON.stringify(completedClasses)); 
            buildClassTable();
            updateList();
            });
        }
        completedClassList.prepend(completedClassRow); 
    }
}

// Loads already added classes to the List
function loadCompletedClasses() {
    const storedClasses = localStorage.getItem("completedClasses");
    if (storedClasses) { //if there are classes it storage add them to the list
        completedClasses = JSON.parse(storedClasses);
        updateList();
    } else { //If there isnt add 2 freshmen classes.
        completedClasses = ["CS149", "MATH231"];
        localStorage.setItem("completedClasses", JSON.stringify(completedClasses));
        updateList();
    }
}

loadCompletedClasses();
document.getElementById('classModal').addEventListener('show.bs.modal', buildClassTable());