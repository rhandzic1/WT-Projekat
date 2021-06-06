const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const sequelize = require('./db.js');
const express = require('express');
const { student, grupa } = require('./db.js');
const app = express();
const { Op } = require("sequelize");
const { urlencoded } = require('body-parser');
const a = sequelize['studentGrupa'];

app.use(express.static('public'));
app.use(bodyParser.json());


//aktivnost
//CREATE
app.post('/v2/aktivnost', (req, res) => {

    let tijeloZahtjeva = req.body;
    let pocetakF = parseFloat(tijeloZahtjeva['pocetak']);
    let krajF = parseFloat(tijeloZahtjeva['kraj']);
    sequelize.aktivnost.findAll({where:{danId:tijeloZahtjeva['danId']}}).then((ak) => {

        let provjeraSudaranja = true;
        if(!(pocetakF < krajF && pocetakF >= 8 && pocetakF <= 20 && krajF >= 8 && krajF <= 20 && (pocetakF % 1 == 0 || pocetakF % 1 == 0.5) && 
        (krajF % 1 == 0 || krajF % 1 == 0.5))) {
            provjeraSudaranja = false;
        }
        
        if(provjeraSudaranja) {
            if(ak != null) {
                for(let i = 0; i < ak.length; i++) {
                    
                    let pocetakF2 = parseFloat(ak[i]['pocetak']);
                    let krajF2 = parseFloat(ak[i]['kraj']);

                    if((pocetakF > pocetakF2 && pocetakF < krajF2) || (krajF > pocetakF2 && krajF < krajF2) || (pocetakF == pocetakF2) || (krajF == krajF2)) {
    
                        provjeraSudaranja = false;
                        break;
                    }
                }
            }
            
            console.log(provjeraSudaranja);
            if(provjeraSudaranja) {
                console.log("nema sudaranja");
                sequelize.aktivnost.create({naziv: tijeloZahtjeva["naziv"].toLowerCase(), pocetak: tijeloZahtjeva["pocetak"].toLowerCase(), kraj: tijeloZahtjeva["kraj"].toLowerCase(),
                predmetId: tijeloZahtjeva["predmetId"], danId: tijeloZahtjeva["danId"], tipId: tijeloZahtjeva["tipId"], grupaId: tijeloZahtjeva["grupaId"]})
                    .then((aktivnost) => {
                        res.status(200).json({message: "Uspjesno kreirana aktivnost"});
                    }).catch((reject) => {
                
                        let greska = {message:"Aktivnost nije validna!"};
                        res.status(400).json(greska);
                    });


            } else {

                res.status(400).json({message:'Termini se sudaraju'});
            }
            
        } else {

            res.status(400).json({message:'Vrijeme nije validno'});

        }
    }).catch((err) => {
        res.status(400).json({message : 'nema'});
    })

});

//READ
app.get('/v2/aktivnost', (req, res) => {
    sequelize.aktivnost.findAll().then((resultSet) => {
        res.status(200).json(resultSet)

    })

});

app.get('/v2/aktivnost/:id', (req, res) => {
    let idAktivnosti = req.params.id;
    sequelize.aktivnost.findOne({where:{id:idAktivnosti}}).then((resultSet) => {
        res.status(200).json(resultSet)

    });

});

//UPDATE 
app.put('/v2/aktivnost/:id', (req, res) => {

    let idAktivnosti = req.params.id;
    sequelize.aktivnost.findOne({where:{id:idAktivnosti}}).then((aktivnost) => {
        aktivnost.update(req.body).then((resolve) => {

            res.status(200).json({message : "Uspješno ažurirana aktivnost"});

        }).catch((reject) => {

            res.status(400).json({message: "Greška prlikom ažuriranja aktivnosti"});

        })
        
    }).catch((err) => {
        res.status(400).json({message : "Greška prilikom ažuriranja aktivnosti"});
    })

});

//DELETE
app.delete('/v2/aktivnost/:id', (req, res) => {

    let idAktivnosti = req.params.id;
    sequelize.aktivnost.findOne({where:{id:idAktivnosti}}).then((aktivnost) => {
        aktivnost.destroy();
        res.status(200).json({message: "Uspjesno obrisana aktivnost"});
    }).catch((reject) => {
        res.status(400).json({message : "Greska prilikom brisanja aktivnosti"});
    })

});


//dan
//CREATE
app.post('/v2/dan', (req, res) => {
    
    let tijeloZahtjeva = req.body;
    sequelize.dan.create({naziv: tijeloZahtjeva["naziv"].toLowerCase()}).then((dan) => {

        res.status(200).json(dan);

    }).catch((reject) => {

        let greska = {message : "Greska"};
        res.status(400).json(greska);
    });

});

//READ
app.get('/v2/dan', (req, res) => {
    sequelize.dan.findAll().then((resultSet) => {
        res.status(200).json(resultSet);
    })

});

app.get('/v2/dan/naziv/:n', (req, res) => {
    let d = req.params.n.toLowerCase();
    sequelize.dan.findOne({where:{naziv:d}}).then((dan) => {
        res.status(200).json(dan);
    })

})

app.get('/v2/dan/:id', (req, res) => {
    let idDan = req.params.id;
    sequelize.dan.findOne({where:{id:idDan}}).then((resultSet) => {
        res.status(200).json(resultSet);
    }).catch((err) => {
        let greska = {message : "Greska"};
        res.status(400).json(greska);
    })

});

//UPDATE 
app.put('/v2/dan/:id', (req, res) => {

    let idDana = req.params.id;

    sequelize.dan.findOne({where:{id:idDana}}).then((dan) => {

        dan.update(req.body).then((resolve) => {

            res.status(200).json({message : "Uspješno ažuriran dan"});

        }).catch((reject) => {

            res.status(400).json({message: "Greška prlikom ažuriranja dana"});

        })
        
    }).catch((err) => {

        res.status(400).json({message : "Greška prilikom ažuriranja dana"});
    
    })
    
});

//DELETE
app.delete('/v2/dan/:id', (req, res) => {
    let idDan = req.params.id;
    sequelize.dan.findOne({where:{id:idDan}}).then((dan) => {
        dan.destroy();
        res.status(200).json({message: "Uspješno obrisan dan"});
    }).catch((err) => {
        res.status(400).json({message: "Greška prilikom brisanja dana"});
    })

});

//grupa
//CREATE
app.post('/v2/grupa', (req, res) => {
    let tijeloZahtjeva = req.body;
    sequelize.grupa.create({naziv: tijeloZahtjeva["naziv"].toLowerCase(), predmetId : tijeloZahtjeva["predmetId"]}).then((grupa) => {
        res.status(200).json({message : "Uspjesno kreirana grupa"});
    }).catch((err) => {
        res.status(400).json({message : "Greška"});
    })
});

//READ
app.get('/v2/grupa', (req, res) => {

    sequelize.grupa.findAll().then((resultSet) => {
        res.status(200).json(resultSet);
    })

});

//Vracanje svih grupa za odredjeni predmet, po id-u predmeta

app.get('/v2/grupa/predmet/:idPredmeta', (req, res) => {

    sequelize.grupa.findAll({where:{predmetId:req.params.idPredmeta}}).then((grupe) => {
        res.status(200).json(grupe);

    }).catch((err) => {
        res.status(400).json({message : "Greška"});
    })

})

//Vracanje svih grupa za odredjeni predmet, ali po id-u jedne grupe

app.get('/v2/grupa/:idGrupe', (req, res) => {

    sequelize.grupa.findOne({where:{id:req.params.idGrupe}}).then((gr) => {
        sequelize.grupa.findAll({where:{predmetId:gr.predmetId}}).then((gru) => {
            res.status(200).json(gru);
        }).catch((err) => {
            res.status(400).json({message : "Greška"});
        })
    })
})


//UPDATE 
app.put('/v2/grupa/:id', (req, res) => {

    let idGrupe = req.params.id;

    sequelize.grupa.findOne({where:{id:idGrupe}}).then((grupa) => {
        
        grupa.update(req.body).then((resolve) => {

            res.status(200).json({message : "Uspješno ažurirana grupa"});

        }).catch((reject) => {

            res.status(400).json({message: "Greška prlikom ažuriranja grupe"});

        })
        
    }).catch((err) => {

        res.status(400).json({message : "Greška prilikom ažuriranja grupe"});
    
    })

});

//DELETE
app.delete('/v2/grupa/:id', (req, res) => {
    let idGrupe = req.params.id;
    sequelize.grupa.findOne({where:{id:idGrupe}}).then((grupa) => {
        grupa.destroy();
        res.status(200).json({message: "Uspješno izbrisana grupa"});
    }).catch((err) => {
        res.status(400).json({message: "Greška prilikom brisanja grupe"});
    })

});

//predmet
//CREATE
app.post('/v2/predmet', (req, res) => {
    let tijeloZahtjeva = req.body;

    sequelize.predmet.create({naziv:tijeloZahtjeva["naziv"].toLowerCase()}).then((predmet) => {

        let uredu = {message : "Uspjesno dodan predmet", predmetId:predmet.id};
        res.status(200).json(uredu);

    }).catch((reject) => {

        let greska = {message : "Greska"};
        res.status(400).json(greska);
    });

})
    

//READ
app.get('/v2/predmet', (req, res) => {
    sequelize.predmet.findAll().then((resultSet) => {
        res.status(200).json(resultSet);
    }).catch((err) => {
        let greska = {message:"greska"};
        res.status(400).json(greska);
    })

});

//UPDATE 
app.put('/v2/predmet/:id', (req, res) => {

    let idPredmeta= req.params.id;

    sequelize.predmet.findOne({where:{id:idPredmeta}}).then((predmet) => {
        
        predmet.update(req.body).then((resolve) => {

            res.status(200).json({message : "Uspješno ažuriran predmet"});

        }).catch((reject) => {

            res.status(400).json({message: "Greška prlikom ažuriranja predmeta"});

        })
        
    }).catch((err) => {

        res.status(400).json({message : "Greška prilikom ažuriranja predmeta"});
    
    })

});

//DELETE
app.delete('/v2/predmet/:id', (req, res) => {
    let predmetId = req.params.id;
    sequelize.predmet.findOne({where:{id:predmetId}}).then((predmet) => {
        predmet.destroy();
        res.status(200).json({message : "Uspješno obrisan predmet"});
    }).catch((err) =>  {
        res.status(400).json({message : "Greška prilikom brisanja predmeta"});
    })

});

//Brisanje predmeta po nazivu
app.delete('/v2/predmet/naziv/:n', (req, res) => {

    let n = req.params.n;
    sequelize.predmet.findOne({where:{naziv:n}}).then((predmet) => {
        predmet.destroy();
        res.status(200).json({message : "Uspješno obrisan predmet po nazivu"});
    }).catch((err) => {
        res.status(400).json({message : "Greška prilikom brisanja predmeta po nazivu"});
    })

})

//student
//CREATE
app.post('/v2/student', (req, res) => {
    let tijeloZahtjeva = req.body;
    sequelize.student.create({ime: tijeloZahtjeva["ime"].toLowerCase(), index: tijeloZahtjeva["index"]}).then((student) => {

        let uredu = {message : "Uspjesno dodan student",id:student.id};
        res.status(200).json(uredu);

    }).catch((reject) => {

        let greska = {message : "Greska"};
        res.status(400).json(greska);
    });


});

//READ
app.get('/v2/student', (req, res) => {
    sequelize.student.findAll().then((resultSet) => {
        res.status(200).json(resultSet);
    }).catch((err) => {
        res.status(400).json({message : "Greška"});
    })

});

//UPDATE 
app.put('/v2/student/:id', (req, res) => {

    let idStudenta = req.params.id;

    sequelize.student.findOne({where:{id:idStudenta}}).then((student) => {
        
        student.update(req.body).then((resolve) => {

            res.status(200).json({message : "Uspješno ažuriran student"});

        }).catch((reject) => {

            res.status(400).json({message: "Greška prlikom ažuriranja studenta"});

        })
        
    }).catch((err) => {

        res.status(400).json({message : "Greška prilikom ažuriranja studenta"});
    
    })


});

//DELETE
app.delete('/v2/student/:id', (req, res) => {
    let idStudenta = req.params.id;
    sequelize.student.findOne({where:{id:idStudenta}}).then((student) => {
        student.destroy();
        res.status(200).json({message : "Student je uspješno obrisan"});
    }).catch((err) => {
        res.status(400).json({message : "Greška prilikom brisanja studenta"});
    })

});

/*app.delete('/v2/student/:indeks', (req, res) => {
    let brojIndeksa = req.params.indeks;
    sequelize.student.findOne({where:{index:brojIndeksa}}).then((student) => {
        student.destroy();
        res.status(200).json({message : "Student je uspješno obrisan"});
    }).catch((err) => {
        res.status(400).json({message : "Greška prilikom brisanja studenta"});
    })

});*/

//tip
//CREATE
app.post('/v2/tip', (req, res) => {

    let tijeloZahtjeva = req.body;
    sequelize.tip.create({naziv: tijeloZahtjeva["naziv"].toLowerCase()}).then((tip) => {

        let uredu = {message : "Uspjesno dodan tip"};
        res.status(200).json(uredu);

    }).catch((reject) => {

        let greska = {message : "Greska"};
        res.status(400).json(greska);
    });
});



//READ
app.get('/v2/tip', (req, res) => {
    sequelize.tip.findAll((resultSet) => {
        res.status(200).json(resultSet);
    })

});

app.get('/v2/tip/naziv/:n', (req, res) => {

    sequelize.tip.findOne({where:{naziv:req.params.n.toLowerCase()}}).then((t) => {
        res.status(200).json(t);

    });
})

//UPDATE 
app.put('/v2/tip/:id', (req, res) => {
    let idTipa = req.params.id;

    sequelize.tip.findOne({where:{id:idTipa}}).then((tip) => {
        
        tip.update(req.body).then((resolve) => {

            res.status(200).json({message : "Uspješno ažuriran tip aktivnosti"});

        }).catch((reject) => {

            res.status(400).json({message: "Greška prlikom ažuriranja tipa aktivnosti"});

        })
        
    }).catch((err) => {

        res.status(400).json({message : "Greška prilikom ažuriranja tipa aktivnosti"});
    
    })

});

//DELETE
app.delete('/v2/tip/:id', (req, res) => {
    let idTipa = req.params.id;
    sequelize.tip.findOne({where:{id:idTipa}}).then((tip) => {
        tip.destroy();
        res.status(200).json({message : "Uspješno obrisan tip aktivnosti"});
    }).catch((err) => {
        res.status(400).json({message : "Greška prilikom brisanja tipa aktivnosti"});
    })

});
app.listen(3000);


//CREATE
app.post('/v2/student_grupa', (req, res) => {
    let tijeloZahtjeva = req.body;

    sequelize.grupa.findOne({where:{id:tijeloZahtjeva["grupaId"]}}).then((gr) => {

        sequelize.student.findOne({where:{id:tijeloZahtjeva["studentId"]}}).then((st) => {
                
            gr.addStudenti([st]); 
            res.status(200).json({message: "Uspješno međutabela"});

        }).catch((err) => {
            res.status(400).json({message: "Greška međutabela"});
        });
        

    }).catch((err) => {
        res.status(400).json({message: "Greška međutabela"});
    });
    
});

//Dodavanje po indeksu
//JSON ostaje isti kao i po id-u, radi konzistentnosti

app.post('/v2/student_grupa/index', (req, res) => {
    let tijeloZahtjeva = req.body;

    sequelize.grupa.findOne({where:{id:tijeloZahtjeva["grupaId"]}}).then((gr) => {

        sequelize.student.findOne({where:{index:tijeloZahtjeva["studentId"]}}).then((st) => {
                
            gr.addStudenti([st]); 
            res.status(200).json({message: "Uspješno međutabela"});

        }).catch((err) => {
            res.status(400).json({message: "Greška međutabela"});
        });
        

    }).catch((err) => {
        res.status(400).json({message: "Greška međutabela"});
    });
    
});


//UPDATE
//Mijenjanje grupe za predmet
app.put('/v2/student_grupa/', (req, res) => {
    
    let tijeloZahtjeva = req.body;
    sequelize.student.findOne({where:{id:tijeloZahtjeva["studentId"]}, include: [{model: grupa, as: 'grupe'}]}).then((st) => {
        
        grupa.findOne({where:{id:tijeloZahtjeva["grupaId1"]}}).then((g) => {
           // console.log(g);
            //g.update({id:tijeloZahtjeva["grupaId2"]});
            
            st.removeGrupe(g).then(() => {

                sequelize.grupa.findOne({where:{id:tijeloZahtjeva["grupaId2"]}}).then((gr) => {
                    gr.addStudenti([st]).then(() => {
                        
                        res.status(200).json({message : "ok"});

                    })
                }).catch((err) => {

                    res.status(400).json({message:"Greška"});

                });
                
            })
        })
    })
})

//Mijenjanje grupe za predmet, po indexu jer je i on jedinstven.
//Format json requesta ostaje isti radi konzistentnosti

app.put('/v2/student_grupa/index', (req, res) => {
    
    let tijeloZahtjeva = req.body;
    sequelize.student.findOne({where:{index:tijeloZahtjeva["studentId"]}, include: [{model: grupa, as: 'grupe'}]}).then((st) => {
        
        grupa.findOne({where:{id:tijeloZahtjeva["grupaId1"]}}).then((g) => {
           // console.log(g);
            //g.update({id:tijeloZahtjeva["grupaId2"]});
            
            st.removeGrupe(g).then(() => {

                sequelize.grupa.findOne({where:{id:tijeloZahtjeva["grupaId2"]}}).then((gr) => {
                    gr.addStudenti([st]).then(() => {
                        
                        res.status(200).json({message : "ok"});

                    })
                }).catch((err) => {

                    res.status(400).json({message:"Greška"});

                });
                
            })
        })
    })
})


//DELETE
app.delete('/v2/student_grupa', (req, res) => {

    let tijeloZahtjeva = req.body;
    sequelize.student.findOne({where:{id:tijeloZahtjeva["studentId"]}, include: [{model: grupa, as: 'grupe'}]}).then((st) => {
        
        grupa.findOne({where:{id:tijeloZahtjeva["grupaId"]}}).then((g) => {
           // console.log(g);
            //g.update({id:tijeloZahtjeva["grupaId2"]});
            
            st.removeGrupe(g).then(() => {
                
                res.status(200).json({message:"Uspješno obrisana grupa za studenta"});

            }).catch((err) => {

                res.status(400).json({message:"Greška prilikom brisanja grupe za studenta"});
            })
        })
    })

})

//READ
app.get('/v2/student_grupa/:id', (req, res) => {

    
    sequelize.student.find({where:{id:req.params.id}}).then((st) => {
        
        st.getGrupe().then((gr) => {
            res.status(200).json(gr);
        })
        
    }).catch((err) => {
        res.status(400).json({message : "Greška"});
    })

});

//Daje sve grupe za studenta po broju indeksa

app.get('/v2/student_grupa/index/:id', (req, res) => {

    
    sequelize.student.find({where:{index:req.params.id}}).then((st) => {
        
        st.getGrupe().then((gr) => {
            res.status(200).json(gr);
        })
        
    }).catch((err) => {
        res.status(400).json({message : "Greška"});
    })

});

app.get('/v2/grupa_student/:id', (req, res) => {

    sequelize.grupa.find({where:{id:req.params.id}}).then((gr) => {
        gr.getStudenti().then((st) => {
            res.status(200).json(st);
        });
    }).catch((err) => {
        res.status(400).json({message : "Greška"});
    })
})

//Zalijepiti sve rute sa prosle spirale, u formatu /v1/
app.get('/v1/predmeti', (req, res) => {

    fs.readFile(__dirname + '/predmeti.txt', (err, data) => {
        
        if(err) {
            throw err;
        } 
        let predmeti = data.toString('UTF-8').split('\n');
        let json = [];

       
        for(var i = 1; i < predmeti.length; i++) {
            let red = {};
            red["naziv"] = predmeti[i].trimEnd();    
            json.push(red);      
        }
    
        res.status(200).json(json);
    });
});

app.get('/v1/aktivnosti', (req, res) => {
    fs.readFile(__dirname + '/aktivnosti.txt', (err, data) => {
        if(err) {
            throw err;
        }
        let aktivnosti = data.toString('utf-8').split('\n');
        let json = [];
        for(let i = 1; i < aktivnosti.length; i++) {
            let red = aktivnosti[i].split(',');
            let pom = {};
            pom["naziv"] = red[0].trimEnd();
            pom["tip"] = red[1].trimEnd();
            pom["pocetak"] = red[2].trimEnd();
            pom["kraj"] = red[3].trimEnd();
            pom["dan"] = red[4].trimEnd();
            json.push(pom);
        }
        //res.writeHead(200, {'Content-Type' : 'application:json'});
        //res.end(JSON.stringify(json, null, '  ').replace(/(?:\\[rn])+/g, ""));
        res.status(200).json(json);
    });
});

app.get('/v1/predmet/:naziv/aktivnost/', (req, res) => {

    //req.params.naziv
    fs.readFile(__dirname + '/aktivnosti.txt', (err, data) => {

        let aktivnosti = data.toString('utf-8').split('\n');
        let json = [];
        let naziv = req.params.naziv;
        if(err) {
            throw err;
        }
        for(let i = 1; i < aktivnosti.length; i++) {
            let red = aktivnosti[i].split(',');
            let pom = {};

            if(red[0].toLowerCase() == naziv.toLowerCase()) {
                pom["naziv"] = red[0].trimEnd();
                pom["tip"] = red[1].trimEnd();
                pom["pocetak"] = red[2].trimEnd();
                pom["kraj"] = red[3].trimEnd();
                pom["dan"] = red[4].trimEnd();
                json.push(pom);
            }
        }
        //res.writeHead(200, {'Content-Type' : 'application:json'});
        //res.end(JSON.stringify(json, null, '  ').replace(/(?:\\[rn])+/g, ""));
        res.status(200).json(json);
    });

});


app.post('/v1/predmet', (req, res) => {

    let tijeloZahtjeva = req.body;
    let noviPredmet = tijeloZahtjeva['naziv'];
    let provjera = true;
    if(noviPredmet.trim()=="")provjera = false;
    fs.readFile(__dirname + '/predmeti.txt', (err, data) => {

        if(err) {
            throw err;
        }
        let predmeti = data.toString('utf-8').split('\n');

        for(let i = 1; i < predmeti.length; i++) {
            if(predmeti[i].localeCompare(noviPredmet) == 0) {
                
                provjera = false;
            }
        }

        if(provjera == true){

            fs.appendFile(__dirname + '/predmeti.txt', '\n' + noviPredmet, err => {
                if(err) {
                    throw err;
                }
                let uredu = {message:"UspjeÅ¡no dodan predmet!"};
                res.status(200).json(uredu);
            
            });
            
        } else {

            let greska = {message:"Naziv predmeta postoji!"};
            res.status(400).json(greska);
        }
       
    });

});

app.post('/v1/aktivnost', (req, res) =>  {

    let tijeloZahtjeva = req.body;
    let provjera = true;
    let naziv = tijeloZahtjeva["naziv"];
    let tip = tijeloZahtjeva["tip"];
    let pocetak = tijeloZahtjeva["pocetak"];
    let kraj = tijeloZahtjeva["kraj"];
    let dan = tijeloZahtjeva["dan"];

    let pocetakF = parseFloat(pocetak);
    let krajF = parseFloat(kraj);

    //Provjera validnosti ulaza
    if(naziv.trim() == "" || tip.trim() =="" || pocetak.trim()=="" || kraj.trim()=="" || dan.trim()=="") {
        provjera = false;
    }
    if(!(pocetakF < krajF && (pocetakF % 1 == 0 || pocetakF % 1 == 0.5) && (krajF % 1 == 0 || krajF % 1 == 0.5) 
    && pocetakF >= 8 && pocetakF<=21 && krajF>=8 && krajF<=21))
    {
        provjera = false;
    }

    fs.readFile(__dirname + '/aktivnosti.txt', (err, data) => {

        if(err) {
            throw err;
        }
        let aktivnosti = data.toString('utf-8').split('\n');
        for(let i = 1; i < aktivnosti.length; i++) {
            
            let red = aktivnosti[i].split(',');
            //Provjeravanje kolizije termina
            if(!(krajF <= parseFloat(red[2]) || pocetakF >= parseFloat(red[3])) && dan == red[4]) {
                
                provjera = false;
                break;
            }
        }

        if(provjera == true){
            let novaAktivnost = "\n" + naziv + "," + tip + "," + pocetak + "," + kraj + "," + dan;
            fs.appendFile(__dirname + '/aktivnosti.txt', novaAktivnost, err => {
                if(err) {
                    throw err;
                }
                let uredu = {message:"UspjeÅ¡no dodana aktivnost!"};
                res.status(200).json(uredu);
            });
        } else {

            let greska = {message:"Aktivnost nije validna!"};
            
            res.status(400).json(greska);
        }
    });
});

app.delete('/v1/aktivnost/:naziv', (req, res) => {

    let naziv = req.params.naziv;
    let provjera = false;

    fs.readFile(__dirname + '/aktivnosti.txt', (err, data) => {

        if(err) {

            throw err;
        }

        let aktivnosti = data.toString('utf-8').split('\n');

        for(let i = 1; i < aktivnosti.length; i++) {
            let r = aktivnosti[i].split(',');
            if(r[0].toLowerCase() == naziv.toLowerCase()) {
                provjera = true;
                break;
            }
        }

        let redovi = aktivnosti.map(red => red.split(','));
        let izlaz = redovi.filter(red => red[0].toLowerCase() != naziv.toLowerCase()).join('\n');


        if(provjera) {
            
            fs.writeFileSync(__dirname + '/aktivnosti.txt', izlaz.trimEnd());
            let uredu = {message:"UspjeÅ¡no obrisana aktivnost!"};
            res.status(200).json(uredu);
        
        } else {

            let greska = {message:"GreÅ¡ka - aktivnost nije obrisana!"};
            res.status(400).json(greska);
        }
    });
});

app.delete('/v1/predmet/:naziv', (req, res) => {

    let naziv = req.params.naziv;
    let provjera = false;

    fs.readFile(__dirname + '/predmeti.txt', (err, data) => {

        if(err) {

            throw err;
        }

        let predmeti = data.toString('utf-8').split('\n');
        

        for(let i = 1; i < predmeti.length; i++) {

            r = predmeti[i];
            
            if(r.toLowerCase().trimEnd() == naziv.toLowerCase()) {

                provjera = true;
                break;
            }
        }
        let izlaz = predmeti.filter(red => red.toLowerCase().trimEnd() != naziv.toLowerCase()).join('\n');

        if(naziv.trim()=="") provjera = false;
        if(provjera) {
            
            fs.writeFileSync(__dirname + '/predmeti.txt', izlaz.trimEnd());
            let uredu = {message:"UspjeÅ¡no obrisan predmet!"};
            res.status(200).json(uredu);
        
        } else {

            let greska = {message:"GreÅ¡ka - predmet nije obrisan!"};
            res.status(400).json(greska);
        }
    });
});

app.delete('/v1/all', (req, res) => {

    let duzina1 = 0;
    let duzina2 = 0;

    fs.readFile(__dirname + '/aktivnosti.txt', (err1, data) => {

        fs.readFile(__dirname + '/predmeti.txt', (err2, data) => {

            if(err1 || err2) {
                let greska = {message:"GreÅ¡ka - sadrÅ¾aj datoteka nije moguÄ‡e obrisati!"};
                res.status(400).json(greska);
                
            } else {
                fs.writeFileSync(__dirname + '/aktivnosti.txt', 'Naziv,tip,pocetak,kraj,dan');
                fs.writeFileSync(__dirname + '/predmeti.txt', 'Predmet');
                let uredu = {message:"UspjeÅ¡no obrisan sadrÅ¾aj datoteka!"};
                res.status(200).json(uredu);
            }
        });
    });
});

