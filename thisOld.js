


String


12
'asdada'
// []
// {}

// const str = false
// const str1 = 'hell1o'
// ''  // new String()
// console.log(str)
// console.log(str.__proto__);


// console.log(
//     Boolean.prototype
// );



// console.log(str.__proto__.__proto__)
// console.log(str1)
// console.log(str1.__proto__)
// console.log(str1.__proto__.__proto__)
// str.__proto__.log = () => console.log(456765456)

Array.prototype.log1 = () => {
    console.log(this);
}

// const r =[]
// r.log()


Array.prototype.log = function(){
    console.log(this);
}



const array = [1,4,6,7]

const array2 = [false,true]
array.log()
array2.log()



const user = {
    log : function(){
        console.log(this)
    },
    name : 'alex'
}


user.log()