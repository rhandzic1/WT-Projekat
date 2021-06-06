let predmeti = [];
let aktivnosti = [];
let dani = [];

window.onload = () => {

    let ucitajPredmete = new XMLHttpRequest();
    ucitajPredmete.onreadystatechange = () => {

        if(ucitajPredmete.readyState == 4 && ucitajPredmete.status == 200) {
            predmeti = JSON.parse(ucitajPredmete.responseText);
        }
    }
    ucitajPredmete.open('GET', 'http://localhost:3000/v2/predmet', true);
    ucitajPredmete.send();


    let ucitajAktivnosti = new XMLHttpRequest();
    ucitajAktivnosti.onreadystatechange = () => {

        if(ucitajAktivnosti.readyState == 4 && ucitajAktivnosti.status == 200) {
            aktivnosti = JSON.parse(ucitajAktivnosti.responseText);
        } 
    }
    ucitajAktivnosti.open('GET', 'http://localhost:3000/v2/aktivnost', true);
    ucitajAktivnosti.send();

    let ucitajDane = new XMLHttpRequest();
    ucitajDane.onreadystatechange = () => {

        if(ucitajDane.readyState == 4 && ucitajDane.status == 200) {
            dani = JSON.parse(ucitajDane.responseText);
        }
    }
    ucitajDane.open('GET', 'http://localhost:3000/v2/dan');
    ucitajDane.send();

    document.getElementById("posalji").addEventListener("click", () => {
        dodajAktivnost();
    });
}

function dodajAktivnost() {
    
    let forma = document.getElementById("unosAktivnosti");
    let json = vratiJSON(forma);
    console.log(json);
    let provjera = false;
    let idPredmeta = -1;

    //PROVJERITI DA LI PREDMET POSTOJI
    for(p of predmeti) {
        
        if(p["naziv"].toLowerCase() == json["naziv"].toLowerCase())
        {
            provjera = true;
            idPredmeta = p['id'];

            break;
        }
    }


    let provjeraVremena = true;

    let pocetakF = parseFloat(json['pocetak']);
    let krajF = parseFloat(json['kraj']);
    if(!(pocetakF < krajF && pocetakF >= 8 && pocetakF <= 20 && krajF >= 8 && krajF <= 20 && (pocetakF % 1 == 0 || pocetakF % 1 == 0.5) && 
    (krajF % 1 == 0 || krajF % 1 == 0.5))) {
        provjeraVremena = false;
    }

    //AKO NE POSTOJI, POSLATI POST ZAHTJEV ZA KREIRANJE PREDMETA
    if(!provjera && provjeraVremena) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = () => {
            
            if(ajax.readyState == 4 && ajax.status == 200) {
                console.log("kreiram predmet, jer ne postoji"); 

                //GRUPU NEĆEMO DODAVATI, JER JE DOZVOLJENO DA VEZA AKTIVNOST GRUPA BUDE N-0
                //POSLATI ZAHTJEV ZA KREIRANJE AKTIVNOSTI

                let idDana = -1;
                let idTipa = -1;
                let pid = -1;
                pid = JSON.parse(ajax.responseText)['predmetId'];
                console.log(pid);
                
                let danRequest = new XMLHttpRequest();
                danRequest.onreadystatechange = () => {
                    if(danRequest.readyState == 4 && danRequest.status == 200) {

                        idDana = JSON.parse(danRequest.responseText)['id'];
                        
                        let tipRequest = new XMLHttpRequest();

                        tipRequest.onreadystatechange = () => {

                            if(tipRequest.readyState == 4 && tipRequest.status == 200) {

                                idTipa = JSON.parse(tipRequest.responseText)['id'];
                                let aktivnost = new XMLHttpRequest();
                                aktivnost.onreadystatechange = () => {
        
                
                                    if(aktivnost.readyState == 4 && aktivnost.status == 200) {
                
                                        alert("Uspješno dodana nova aktivnost");
                                        let ucitajPredmete = new XMLHttpRequest();
                                        ucitajPredmete.onreadystatechange = () => {
                
                                            if(ucitajPredmete.readyState == 4 && ucitajPredmete.status == 200) {
                                                predmeti = JSON.parse(ucitajPredmete.responseText);
                                            }
                                        }
                                        ucitajPredmete.open('GET', 'http://localhost:3000/v2/predmet', true);
                                        ucitajPredmete.send();
                
                
                                        let ucitajAktivnosti = new XMLHttpRequest();
                                        ucitajAktivnosti.onreadystatechange = () => {
                
                                            if(ucitajAktivnosti.readyState == 4 && ucitajAktivnosti.status == 200) {
                                                aktivnosti = JSON.parse(ucitajAktivnosti.responseText);
                                            }
                                        }
                                        ucitajAktivnosti.open('GET', 'http://localhost:3000/v2/aktivnost', true);
                                        ucitajAktivnosti.send();
                
                                        let ucitajDane = new XMLHttpRequest();
                                        ucitajDane.onreadystatechange = () => {
                
                                            if(ucitajDane.readyState == 4 && ucitajDane.status == 200) {
                                                dani = JSON.parse(ucitajDane.responseText);
                                            }
                                        }
                                        ucitajDane.open('GET', 'http://localhost:3000/v2/dan');
                                        ucitajDane.send();
                
                
                                    } else if(aktivnost.readyState == 4) {
                
                                        
                                        
                                        let ucitajPredmete = new XMLHttpRequest();
                                        ucitajPredmete.onreadystatechange = () => {
                
                                            if(ucitajPredmete.readyState == 4 && ucitajPredmete.status == 200) {
                                                predmeti = JSON.parse(ucitajPredmete.responseText);
                                                console.log(predmeti);
                                            }
                                        }
                                        ucitajPredmete.open('GET', 'http://localhost:3000/v2/predmet', true);
                                        ucitajPredmete.send();

                                        alert("Aktivnost nije validna2");

                
                                    }
                                }
                                aktivnost.open('POST', 'http://localhost:3000/v2/aktivnost', true);
                                aktivnost.setRequestHeader("Content-Type" , "application/json");
                                aktivnost.send(JSON.stringify({naziv:json['naziv'] + " " + json['tip'], pocetak:json['pocetak'], kraj:json['kraj'], predmetId: pid, danId:idDana, tipId:idTipa}));
                            }
                        
                        }
                        tipRequest.open('GET', 'http://localhost:3000/v2/tip/naziv/' + json['tip']);
                        tipRequest.send();
                    }
                }
                danRequest.open('GET', 'http://localhost:3000/v2/dan/naziv/' + json['dan']);
                danRequest.send();
            }
        }
        ajax.open('POST', 'http://localhost:3000/v2/predmet', true);
        ajax.setRequestHeader("Content-Type" , "application/json");
        ajax.send(JSON.stringify({naziv:json["naziv"]}));
    }

    else if(provjeraVremena){
        let danRequest = new XMLHttpRequest();
        let idDana = -1;
        let idTipa = -1;
        danRequest.onreadystatechange = () => {
            if(danRequest.readyState == 4 && danRequest.status == 200) {

                idDana = JSON.parse(danRequest.responseText)['id'];
                
                let tipRequest = new XMLHttpRequest();

                tipRequest.onreadystatechange = () => {

                    if(tipRequest.readyState == 4 && tipRequest.status == 200) {

                        idTipa = JSON.parse(tipRequest.responseText)['id'];
                        let aktivnost = new XMLHttpRequest();
                        aktivnost.onreadystatechange = () => {

        
                            if(aktivnost.readyState == 4 && aktivnost.status == 200) {
        
                                alert("Uspješno dodana nova aktivnost");
                                let ucitajPredmete = new XMLHttpRequest();
                                ucitajPredmete.onreadystatechange = () => {
        
                                    if(ucitajPredmete.readyState == 4 && ucitajPredmete.status == 200) {
                                        predmeti = JSON.parse(ucitajPredmete.responseText);
                                    }
                                }
                                ucitajPredmete.open('GET', 'http://localhost:3000/v2/predmet', true);
                                ucitajPredmete.send();
        
        
                                let ucitajAktivnosti = new XMLHttpRequest();
                                ucitajAktivnosti.onreadystatechange = () => {
        
                                    if(ucitajAktivnosti.readyState == 4 && ucitajAktivnosti.status == 200) {
                                        aktivnosti = JSON.parse(ucitajAktivnosti.responseText);
                                    }
                                }
                                ucitajAktivnosti.open('GET', 'http://localhost:3000/v2/aktivnost', true);
                                ucitajAktivnosti.send();
        
                                let ucitajDane = new XMLHttpRequest();
                                ucitajDane.onreadystatechange = () => {
        
                                    if(ucitajDane.readyState == 4 && ucitajDane.status == 200) {
                                        dani = JSON.parse(ucitajDane.responseText);
                                    }
                                }
                                ucitajDane.open('GET', 'http://localhost:3000/v2/dan');
                                ucitajDane.send();
        
        
                            } else if(aktivnost.readyState == 4) {
        
                                alert("Aktivnost nije validna 1");
        
                            }
                        }
                        aktivnost.open('POST', 'http://localhost:3000/v2/aktivnost', true);
                        aktivnost.setRequestHeader("Content-Type" , "application/json");
                        aktivnost.send(JSON.stringify({naziv:json['naziv'] + " " + json['tip'], pocetak:json['pocetak'], kraj:json['kraj'], predmetId: idPredmeta, danId:idDana, tipId:idTipa}));
                    }
                
                }
                tipRequest.open('GET', 'http://localhost:3000/v2/tip/naziv/' + json['tip']);
                tipRequest.send();
            }
        }
        danRequest.open('GET', 'http://localhost:3000/v2/dan/naziv/' + json['dan']);
        danRequest.send();
        
    } else {

        alert("Vrijeme nije validno");
    }
}

function vratiJSON(forma) {
    let json = {};
    for(polje of new FormData(forma)) {
        json[polje[0]] = polje[1];
    }
    return json;
}