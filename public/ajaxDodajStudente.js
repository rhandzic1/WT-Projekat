let studenti = [];
let grupeId= [];

window.onload = () => {

    let grupeSelect = document.getElementById("grupe");
    let ucitajGrupe = new XMLHttpRequest();
    
    ucitajGrupe.onreadystatechange = () => {

        if(ucitajGrupe.readyState == 4 && ucitajGrupe.status == 200) {
            
            grupeId.push(JSON.parse(ucitajGrupe.responseText));
            let grupe = JSON.parse(ucitajGrupe.responseText);
            let index = 0;

            document.getElementById("posalji").addEventListener("click", () => {
                dodajStudente();
            });

            for(grupa of grupe) {

                let opt = document.createElement("option");
                opt.value= index;
                opt.innerHTML = grupa["naziv"];
                grupeSelect.appendChild(opt);
                index++;
            }
        }

    }
    ucitajGrupe.open('GET', 'http://localhost:3000/v2/grupa', true);
    ucitajGrupe.send();
}

function dodajStudente() {
    
    let podaci = parsirajCSV();
    let poruke = [];
    let vrijednostSelecta = document.getElementById("grupe").value;

    let brojGrupe = grupeId[0][vrijednostSelecta]["id"];
    

    let ucitajStudente = new XMLHttpRequest();
    ucitajStudente.onreadystatechange = () => {

        if(ucitajStudente.readyState == 4 && ucitajStudente.status == 200) {
            studenti = JSON.parse(ucitajStudente.responseText);
            
            for(podatak of podaci) {
                let red = podatak.split(",");
                let imePrezime = red[0];
                let brojIndeksa = red[1];
                let provjera1 = true;
                let provjera2 = true;
                let pomocniStudent;
        
                for(let i = 0; i < studenti.length; i++) {
        
                    if(studenti[i]["ime"].toLowerCase() == imePrezime.toLowerCase()) {
                        provjera1 = false;
                    }
        
                    if(studenti[i]["index"] == brojIndeksa) {
        
                        provjera2 = false;
                        pomocniStudent = studenti[i];
                    }
                }
        
                if(provjera1 && provjera2) {
        
                    let dodajStudentaRequest = new XMLHttpRequest();
        
                    dodajStudentaRequest.onreadystatechange = () => {
        
                        if(dodajStudentaRequest.readyState == 4 && dodajStudentaRequest.status == 200) {

                            let id = JSON.parse(dodajStudentaRequest.responseText)["id"];
                            //U RESPONESU SE DOBIJE I id NOVOG STUDENTA
                            let dodajGrupuRequest = new XMLHttpRequest();
                            dodajGrupuRequest.onreadystatechange = () => {
                                
                                if(dodajGrupuRequest.readyState == 4 && dodajGrupuRequest.status == 200) {

                                    document.getElementById("student").value = [];
                                    
                                }

                            }
                            dodajGrupuRequest.open('POST', 'http://localhost:3000/v2/student_grupa', true);
                            dodajGrupuRequest.setRequestHeader("Content-Type", "application/json");
                            dodajGrupuRequest.send(JSON.stringify({studentId:id,grupaId:brojGrupe}));
                        
                            
                        } else if(dodajStudentaRequest.readyState == 4) {
                            
                            
                        }
                    }
                
                    dodajStudentaRequest.open('POST', 'http://localhost:3000/v2/student', true);
                    dodajStudentaRequest.setRequestHeader("Content-Type" , "application/json");
                    dodajStudentaRequest.send(JSON.stringify({ime : imePrezime, index : brojIndeksa}));
        
                } else if(provjera1 && !provjera2) {
                    
                    poruke.push("Student " + imePrezime + " nije kreiran jer već postoji student " + pomocniStudent["ime"] + 
                    " sa istim indeksom " + pomocniStudent["index"]);
                    document.getElementById("student").value = poruke;

                } else if(!provjera1 && !provjera2) {


                    console.log("USO SAM OVDJE");

                    //OVDJE TREBA RPROVJERITI DA LI JE NOVA ODABRANA GRUPA
                    //GRUPA IZ ISTOG PREDMETA
                    let dajGrupuPredmeteRequest = new XMLHttpRequest();
                    dajGrupuPredmeteRequest.onreadystatechange = () => {

                        if(dajGrupuPredmeteRequest.readyState == 4 && dajGrupuPredmeteRequest.status == 200)
                        {
                            //console.log(dajGrupuPredmeteRequest.responseText)
                            let grupeZaPredmet = JSON.parse(dajGrupuPredmeteRequest.responseText);
                            
                            let dajSveStudentoveGrupeRequest = new XMLHttpRequest();

                            dajSveStudentoveGrupeRequest.onreadystatechange = () => {

                                if(dajSveStudentoveGrupeRequest.readyState == 4 && dajSveStudentoveGrupeRequest.status == 200) {

                                    let studentoveGrupe = JSON.parse(dajSveStudentoveGrupeRequest.responseText);
                                    let dodavanje = false;
                                    console.log(grupeZaPredmet);
                                    console.log(studentoveGrupe);


                                    //AKO SE MEDJU TIM GRUPAMA NALAZI NEKI grupeZaPredmet[i]
                                    //POZIVA SE UPDATE ZAHTJEV
                                    let idStareGrupe = -1;
                                    console.log("USO sam OVDJE 2");
                                    for(g1 of grupeZaPredmet) {
                                        
                                        for(g2 of studentoveGrupe) {
                                            console.log("USO sam OVDJE 3");
                                            console.log("id1: " + g1['id']);
                                            console.log("id2: " + g2['student_grupa']['grupaId']);
                                            if(g1['id'] == g2['student_grupa']['grupaId']) {
                                                
                                                console.log("id1: " + g1['id']);
                                                console.log("id2: " + g2['student_grupa']['grupaId']);
                                                dodavanje = true;
                                                idStareGrupe = g2['student_grupa']['grupaId'];
                                                break;
                                            }
                                        }
                                        if(dodavanje) break;
                                    }

                                    if(dodavanje) {
                                    //AKO JE OVAJ USLOV ISPUNJEN TO ZNAČI DA TREBA IZVRŠITI UPDATE 
                                        console.log("id stare grupe: " +  idStareGrupe);
                                        console.log("broj indeksa: " + brojIndeksa);
                                        console.log("id nove grupe: " + brojGrupe);
                                        let izmijeniGrupuRequest = new XMLHttpRequest()
                                        izmijeniGrupuRequest.onreadystatechange = () => {

                                            if(izmijeniGrupuRequest.readyState == 4 && izmijeniGrupuRequest.status == 200) {

                                                document.getElementById("student").value = [];

                                            }

                                        }
                                        izmijeniGrupuRequest.open('PUT', '/v2/student_grupa/index', true);
                                        izmijeniGrupuRequest.setRequestHeader("Content-Type" , "application/json");
                                        izmijeniGrupuRequest.send(JSON.stringify({studentId:brojIndeksa, grupaId1:idStareGrupe, grupaId2:brojGrupe}));

                                    } else {
                                    //TREBA PROSTO DODATI GRUPU SUDENTU, JER NE POSTOJI GRUPA VEZANA ZA TAJ PREDMET 
                                        console.log("dodavanje za novi predmet");
                                        let dodajGrupuStudentRequest = new XMLHttpRequest();
                                        dodajGrupuStudentRequest.onreadystatechange = () => {

                                            if(dodajGrupuStudentRequest.readyState == 4 && dodajGrupuStudentRequest.status == 200) {
                                                document.getElementById("student").value = [];

                                            }
                                        }
                                        dodajGrupuStudentRequest.open('POST', '/v2/student_grupa/index', true);
                                        dodajGrupuStudentRequest.setRequestHeader("Content-Type" , "application/json");
                                        dodajGrupuStudentRequest.send(JSON.stringify({studentId:brojIndeksa, grupaId:brojGrupe}));
                                    }
                                }
                            }

                            dajSveStudentoveGrupeRequest.open('GET', '/v2/student_grupa/index/' + brojIndeksa, true);
                            dajSveStudentoveGrupeRequest.send();
                            //SADA TREBA DOBITI SVE GRUPE ZA STUDENTA
                            

                        } 
                    }
                    dajGrupuPredmeteRequest.open('GET', 'http://localhost:3000/v2/grupa/' + brojGrupe, true);
                    dajGrupuPredmeteRequest.send();

                }
            }
        }
    }
    ucitajStudente.open('GET', 'http://localhost:3000/v2/student', true);
    ucitajStudente.send();
}

function parsirajCSV() {

    let podaci = document.getElementById("student").value.split("\n");
    return podaci;
}

function load() {
    let ucitajStudente = new XMLHttpRequest();
    ucitajStudente.onreadystatechange = () => {

        if(ucitajStudente.readyState == 4 && ucitajStudente.status == 200) {
            studenti = JSON.parse(ucitajStudente.responseText);
        }
    }
    ucitajStudente.open('GET', 'http://localhost:3000/v2/student', true);
    ucitajStudente.send();
}