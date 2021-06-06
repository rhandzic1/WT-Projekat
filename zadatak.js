const { response } = require('express');
const express = require('express');
const app = express();
app.use(express.static('public'));
const fs = require('fs');
const bodyParser = require('body-parser');
let path = require('path');
const { parse } = require('path');
let public = path.join(__dirname, 'public');

app.use(bodyParser.json());

app.get('/predmeti', (req, res) => {

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

app.get('/aktivnosti', (req, res) => {
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

app.get('/predmet/:naziv/aktivnost/', (req, res) => {

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


app.post('/predmet', (req, res) => {

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
                let uredu = {message:"Uspješno dodan predmet!"};
                res.status(200).json(uredu);
            
            });
            
        } else {

            let greska = {message:"Naziv predmeta postoji!"};
            res.status(400).json(greska);
        }
       
    });

});

app.post('/aktivnost', (req, res) =>  {

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
                let uredu = {message:"Uspješno dodana aktivnost!"};
                res.status(200).json(uredu);
            });
        } else {

            let greska = {message:"Aktivnost nije validna!"};
            
            res.status(400).json(greska);
        }
    });
});

app.delete('/aktivnost/:naziv', (req, res) => {

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
            let uredu = {message:"Uspješno obrisana aktivnost!"};
            res.status(200).json(uredu);
        
        } else {

            let greska = {message:"Greška - aktivnost nije obrisana!"};
            res.status(400).json(greska);
        }
    });
});

app.delete('/predmet/:naziv', (req, res) => {

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
            let uredu = {message:"Uspješno obrisan predmet!"};
            res.status(200).json(uredu);
        
        } else {

            let greska = {message:"Greška - predmet nije obrisan!"};
            res.status(400).json(greska);
        }
    });
});

app.delete('/all', (req, res) => {

    let duzina1 = 0;
    let duzina2 = 0;

    fs.readFile(__dirname + '/aktivnosti.txt', (err1, data) => {

        fs.readFile(__dirname + '/predmeti.txt', (err2, data) => {

            if(err1 || err2) {
                let greska = {message:"Greška - sadržaj datoteka nije moguće obrisati!"};
                res.status(400).json(greska);
                
            } else {
                fs.writeFileSync(__dirname + '/aktivnosti.txt', 'Naziv,tip,pocetak,kraj,dan');
                fs.writeFileSync(__dirname + '/predmeti.txt', 'Predmet');
                let uredu = {message:"Uspješno obrisan sadržaj datoteka!"};
                res.status(200).json(uredu);
            }
        });
    });
});

module.exports = app.listen(3000);