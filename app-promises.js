const users = [{
    id: 1,
    name: 'miguel',
    schoolId: 101
},
{
    id: 2,
    name: 'paula',
    schoolId: 999
}];

const grades = [{
    id: 1,
    schoolId: 101,
    grade: 90
}, {
    id: 2,
    schoolId: 101,
    grade: 23,
}, {
    id: 3,
    schoolId: 999,
    grade: 100
}];

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        const user = users.find((user) => user.id === id);

        if (user) {
            resolve(user);
        } else {
            reject(`Unable to find user with id of ${id}.`);
        }
    });
};

const getGrades = (schoolId) => {
    return new Promise((resolve, reject) => {
        resolve(grades.filter((grade) => grade.schoolId == schoolId));
    });
};



const getStatus = (userId) => {
    let user;
    return getUser(userId).then((tempUser) => {
        user = tempUser;
        return getGrades(user.schoolId);
    }).then((grades) => {
        let average = 0;
        if (grades.length > 0) {
            average = grades.map((grade) => grade.grade).reduce((a, b) => a + b) / grades.length;
        }
        return (`${user.name} has a ${average}% in the class.`);
    });
};

getStatus(1).then((status) => {
    console.log(status);
}).catch((e) => {
    console.log(e);
});

//using async await. to reemplace getStatus
const getStatusAlt = async (userId) => {
    const user = await getUser(userId);
    const grades = await getGrades(user.schoolId);
    let average = 0;
    if (grades.length > 0) {
        average = grades.map((grade) => grade.grade).reduce((a, b) => a + b) / grades.length;
    }
    return (`${user.name} has a ${average}% in the class.`);
};

getStatusAlt(1).then((status) => {
    console.log(status);
}).catch((e) => {
    console.log(e);
});

//you cannot make await in an async function, there is no top, you have to call it with "then" statement, because the async returns a promise.
//const statusAlt = await getStatuslAlt(1);
const statuslAlt = getStatusAlt(1);
statuslAlt.then((res)=>{
    console.log(res)
});


