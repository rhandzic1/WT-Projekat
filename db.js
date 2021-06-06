const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt2018315","root","root",
{
    host:"127.0.0.1",
    dialect:"mysql",
    logging:false
});

const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.aktivnost = sequelize.import(__dirname + '/aktivnost.js');
db.dan = sequelize.import(__dirname + '/dan.js');
db.grupa = sequelize.import(__dirname + '/grupa.js');
db.predmet = sequelize.import(__dirname + '/predmet.js');
db.student = sequelize.import(__dirname + '/student.js');
db.tip = sequelize.import(__dirname + '/tip.js');


//relacije
//Jedan predmet ima N grupa
//getGrupePredmeta() i setGrupePredmeta()
db.predmet.hasMany(db.grupa,{as:'grupePredmeta', foreignKey:{name:'predmetId', allowNull:false}});
db.grupa.belongsTo(db.predmet,{foreignKey:{name:'predmetId', allowNull:false}});

//Jedan premet ima N aktivnosti
//getAktivnostiPredmeta() i setAktivnostiPredmeta()
db.predmet.hasMany(db.aktivnost,{as:'aktivnostiPredmeta', foreignKey:{name:'predmetId', allowNull:false}});
db.aktivnost.belongsTo(db.predmet,{foreignKey:{name:'predmetId', allowNull:false}});

//Jedan dan im N aktivnosti
//getAktivnostiDana() i setAktivnostiDana()
db.dan.hasMany(db.aktivnost,{as:'aktivnostiDana', foreignKey:{name:'danId', allowNull:false}});
db.aktivnost.belongsTo(db.dan,{foreignKey: {name:'danId', allowNull:false}});

//Jedan tip ima N aktivnosti
//getAktivnostiTipa() i setAktivnostiTipa()
db.tip.hasMany(db.aktivnost,{as:'aktivnostiTipa', foreignKey:{name:'tipId', allowNull:false}});
db.aktivnost.belongsTo(db.tip,{foreignKey:{name:'tipId', allowNull:false}});

//Jedan student moze pripadati u više grupa, a jedna grupa ima više studenata, many to many relacija
db.studentGrupa = db.student.belongsToMany(db.grupa,{as:'grupe',through:'student_grupa',foreignKey:{name:'studentId', allowNull:false}});
db.grupa.belongsToMany(db.student,{as:'studenti',through:'student_grupa',foreignKey:{name:'grupaId', allowNull:false}});

//
db.grupa.hasMany(db.aktivnost,{as:'grupaAktivnosti', foreignKey:{name:'grupaId', allowNull:true}});



module.exports = db;