//= components/popup.js
//= components/slider.js
//= components/file.js

//const message = require("./components/file.js"); // подкл модуля


/* function sum() {

    return x + y;
} */

/* console.log(sum()); */
console.log("This is index.js");

const name = () => console.log("my name is Alex");

/* тттт */

const person = {
    name: "Alex",
    age: 28,
};

person.name = "Alexey";

const wait = () =>
    new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
    });

wait()
    .then(() => {
        console.log("I promised to run after 1s");
        return wait();
    })
    .then(() => console.log("I promised to run after 2s"));