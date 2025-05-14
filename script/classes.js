let completedClasses = [];
let gradPlan = [];

const AllClasses = new Map([ //Class# : Objects(Class name, Prerequisites)
    ["CS149", { name: "Introduction to Programming", prereqs: [], type: "CS149" }],
    ["CS159", { name: "Advanced Programming", prereqs: ["CS149"] }],
    ["MATH220", { name: "Elementary Statistics", prereqs: [] }],
    ["MATH231", { name: "Calculus with Functions I", prereqs: [] }],
    ["MATH232", { name: "Calculus with Functions II", prereqs: ["MATH231"] }],
    ["CS227", { name: "Discrete Structures I", prereqs: ["CS149"] }],
    ["CS240", { name: "Algorithms & Data Structures", prereqs: ["CS159", "CS227", "MATH231"] }],
    ["CS261", { name: "Computer Systems I", prereqs: ["CS227", "CS159"] }],
    ["CS327", { name: "Discrete Structures II", prereqs: ["CS227", "CS240"] }],
    ["CS330", { name: "Societal and Ethical Issues in Computing", prereqs: ["CS159"] }],
    ["CS332", { name: "Technical Communication for Computer Science", prereqs: ["CS159"] }],
    ["CS343", { name: "Application Development", prereqs: ["CS159"] }],
    ["CS345", { name: "Software Engineering", prereqs: ["CS159"] }],
    ["CS347", { name: "Web Development", prereqs: ["CS343"] }],
    ["CS349", { name: "Developing Interactive Multimedia", prereqs: ["CS240"] }],
    ["CS354", { name: "Introduction to Autonomous Robotics", prereqs: ["CS240", "MATH220"] }],
    ["CS361", { name: "Computer Systems II", prereqs: ["CS240", "CS261"] }],
    ["CS374", { name: "Database Systems", prereqs: ["CS240"] }],
    ["CS412", { name: "Applied Algorithms", prereqs: ["CS327", "MATH220"] }],
    ["CS430", { name: "Programming Languages", prereqs: ["CS240", "CS261"] }],
    ["CS432", { name: "Compilers", prereqs: ["CS327", "CS361"] }],
    ["CS444", { name: "Artificial Intelligence", prereqs: ["CS240", "MATH220"] }],
    ["CS445", { name: "Machine Learning", prereqs: ["CS327", "MATH220"] }],
    ["CS446", { name: "Software Analysis and Design", prereqs: ["CS240", "CS345"] }],
    ["CS447", { name: "Interaction Design", prereqs: ["CS343"] }],
    ["CS449", { name: "Numerical Analysis for Differential Equations", prereqs: ["CS159"] }],
    ["CS450", { name: "Operating Systems", prereqs: ["CS361"] }],
    ["CS452", { name: "Analysis of Algorithms", prereqs: ["CS327", "MATH220", "CS240"] }],
    ["CS455", { name: "Advanced Computer Networking", prereqs: ["CS361"] }],
    ["CS470", { name: "Special Topics", prereqs: ["CS361"] }],
]);

function getDependentClasses(classNumber) { //Post-requisites
    const dependents = [];
    for (let i = 0; i < completedClasses.length; i++) {
        const classData = AllClasses.get(completedClasses[i]);
        let prereqs = [];
        if (classData && classData.prereqs) {
            prereqs = classData.prereqs;
        }

        if (prereqs.includes(classNumber)) {
            dependents.push(completedClasses[i]);
        }
    }
    return dependents;
}

const ClassPriority = [
    "CS149",
    "MATH231",
    "CS159",
    "CS227",
    "MATH232",
    "CS240",
    "CS261",
    "CS345",
    "MATH220",
    "CS327",
    "Elective1",
    "CS361",
    "CS430",
    "Elective2",
    "Algorithim Elective",
    "Elective3",
    "Systems Elective"
];

const requiredClasses = [
    "CS149",  
    "CS159",  
    "CS227",  
    "MATH231",  
    "MATH232",  
    "MATH220",  
    "CS240",  
    "CS261",  
    "CS327",  
    "CS345",  
    "CS361",  
    "CS430", 
    "Elective1",
    "Elective2",
    "Elective3",
    "Algorithim Elective",
    "Systems Elective",
];

const classDifficulty = new Map([
    ["CS149", 3],
    ["CS159", 5],
    ["CS227", 2],
    ["MATH231", 2],
    ["MATH232", 3],
    ["MATH220", 2],
    ["CS240", 8],
    ["CS261", 8],
    ["CS327", 5],
    ["CS345", 8],
    ["CS361", 9],
    ["CS430", 7],
    ["Elective1", 5],
    ["Elective2", 5],
    ["Elective3", 5],
    ["Algorithim Elective", 9],
    ["Systems Elective", 9]
]);

const systemsElectives = [
    "CS432",
    "CS450",
    "CS455",
    "CS456",
    "CS470"
]

const algorithimElective = [
    "CS412",
    "CS452"
]

const electives = [
    "CS330",
    "CS332",
    "CS343",
    "CS347",
    "CS349",
    "CS354",
    "CS374",
    "CS444",
    "CS445",
    "CS446",
    "CS447",
    "CS449"
];
