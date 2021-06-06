const db = require('./db.js');
db.sequelize.sync({force:true}).then(() => {
    
    console.log("Gotovo kreiranje tabela");
    process.exit();
    
});