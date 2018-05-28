const express = require('express'); 
const apiRouter = express.Router(); 
module.exports = apiRouter; 

/* Express router for employees*/
const employeesRouter = require('./employees'); 
apiRouter.use('/employees', employeesRouter); 

/* Express router for menus */
const menusRouter = require('./menus'); 
apiRouter.use('/menus', menusRouter); 