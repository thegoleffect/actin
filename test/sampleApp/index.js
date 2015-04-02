var Actin = require('../../');

// new Actin().controllers(function (err, controllers) {
    
//     console.log(controllers);
// });


var controllers = new Actin().controllersSync();
console.log(controllers)