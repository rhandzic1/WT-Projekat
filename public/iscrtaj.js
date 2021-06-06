function iscrtajRaspored(div, dani, satPocetak, satKraj) {

    if(!((satPocetak % 1 == 0 && satKraj % 1 == 0) && 
        (satPocetak < satKraj) && (satPocetak >= 0 && satPocetak <= 24) && (satKraj >= 0 && satKraj <= 24))) {
            alert("Greška");
            return "Greška";
        }
    
        if(div == null) {
            alert("div je null");
            return "div je null";
        }

        if(dani == null) {
            alert("div je null");
            return "dani su null";
        }
    
        let str = '<div class="blank kreiran" id=h' + satPocetak + div.id + '"></div>';
        let pomocniSati = satPocetak;
        let brojacSati = 1;
        let duzinaBlanka = -1;
        let pocetniIndeksSati = -1;
    
        if(satPocetak % 2 == 0) {
    
            duzinaBlanka = 3;
            pocetniIndeksSati = 4;
    
        } else {
    
            duzinaBlanka = 5;
            pocetniIndeksSati = 6;
            pomocniSati++;
        }
    
        if(satKraj - satPocetak == 1) {
            str += '<div class="vrh sati sati1">';
            let h = satPocetak;
            
            if(h % 2 == 0) {

                if(h < 0) {
                    
                    str += '0';
                }

                str += h;
                str += ':00';
            }
            str += '</div>';
            str += '<div></div>';

        }

        if((satKraj - satPocetak) == 2 && satPocetak % 2 == 1) {

            str += '<div class="vrh sati sati1">';

            if((satPocetak + satKraj) / 2 < 0) {
                    
                str += '0';
            }

            h = (satPocetak + satKraj) / 2;
            str += h;
            str += ':00';
            str += '</div>';

        }

        for(let i = 0; i < (satKraj - satPocetak) / 2 - 1; i++) {
    
            str += '<div class="vrh sati sati' + brojacSati + '">';
            if(pomocniSati < 10) {
                str += '0';
            }
            str += pomocniSati + ':00</div>';
            str += '<div class="vrh izmedju';
            if(pomocniSati == 12) str += ' duza';
            str += '"></div>';
    
            brojacSati++;
            if(pomocniSati == 12) {
    
                pomocniSati += 3;
    
            } else {
    
                pomocniSati += 2;
            }
            
        }
    
        if(satKraj % 2 == 0 && satPocetak % 2 == 0) {
    
            str += '<div class="vrh sati sati' + brojacSati + '">' + pomocniSati + ':00</div>';
            str += '<div class="vrh izmedju"></div>';
        }

        if(satPocetak % 2 == 0 && satKraj % 2 == 1 && pomocniSati != satKraj) {
            str += '<div class="vrh sati sati' + brojacSati + '">' + pomocniSati + ':00</div>';

        }
    
    
        let sati = satPocetak;
        for(let i = 1; i < dani.length + 1; i++) {
    
            for(let j = 0; j < (satKraj - satPocetak) * 2 + 1; j++) {
    
                if(j == 0) {
    
                    str += '<div class="dani dan' + i ;
                   /* if(i == dani.length) {
    
                        str += ' posljednjiDan';
                    }*/
    
                    str += '">' + dani[i - 1] + '</div>';
                    sati = satPocetak;
    
                    } else {
    
                        if(j % 2 == 0) {
    
                            str += '<div class="' + div.id + dani[i-1] + ' h' + sati; //MODIFIKACIJA SA ID-JEM
                            if(i == 1) {
                                str += ' prviDan';
                            }
                            
                            str += ' prazna neparna"></div>';
                        } else {
    
                            str += '<div class="' + div.id + dani[i-1] + ' h' + sati; //MODIFIKACIJA SA ID-JEM
                            if(i == 1) {
                                str += ' prviDan';
                            }
                            str += ' prazna parna"></div>';
                        }
                    sati += 0.5;
                        
                }
            }
        }
    
        div.innerHTML = str;
        //broj ćelija, za naziv dana su rezervisane 4 celije u gridu
        let sirina = (satKraj - satPocetak) * 2 ;
    
        div.style.gridTemplateColumns = "auto auto 20px 20px repeat(" + sirina + ", 1fr)";
        
    
        div.getElementsByClassName('blank')[0].style.gridColumn= "1 / span " + duzinaBlanka;
    
        let days = div.getElementsByClassName('dani');
    
        //poravnavanje dana u gridu
        for(let i = 0; i < days.length; i++) {
            days[i].style.gridColumn = "1 / span 4";
            days[i].style.gridRow = i+2;
        }

        let prazne = div.getElementsByClassName('prazna');
        for(let i = 0; i < dani.length; i++) {
            for(let j = 0; j < (satKraj - satPocetak)*2; j++) {

                prazne[j +(satKraj - satPocetak)*2*i].style.gridRow = i + 2;
            }
        }
    
        let hours = div.getElementsByClassName('sati');
        let bl = -1;
      
        for(let i = 0; i < hours.length; i++) {
            hours[i].style.gridColumn = "" + pocetniIndeksSati + " / span 2";
    
            if(hours[i].textContent == "12:00") {
                
                bl = pocetniIndeksSati + 2;
                pocetniIndeksSati += 6;
                
            }
            else {
                pocetniIndeksSati += 4;
            }
        }
    
        let izmedjuSati = div.getElementsByClassName('vrh izmedju');
    
        let poc = -1;
    
        if(satPocetak % 2 == 0) {
            poc = 6;
    
        } else {
            poc = 8;
        }
        
        if(izmedjuSati != null) {

            for(let i = 0; i < izmedjuSati.length; i++) {
    
                izmedjuSati[i].style.gridColumn ="" + poc + "/ span 2";
                izmedjuSati[i].style.gridRow = 1;
                if(hours[i].textContent == "12:00") {
                    poc += 6;
                } else {
                    poc += 4;
                }
            }
        }
        
    
        let broj = (satKraj - satPocetak) * 2 + 2;
        if(izmedjuSati != null && izmedjuSati.length != 0) {

            izmedjuSati[izmedjuSati.length - 1].style.gridColumn = "" + broj +  " / span 3";
        }
        
        let duziBlank = div.getElementsByClassName('duza')[0];
        if(bl != -1 && duziBlank != null) {
            duziBlank.style.gridColumn = "" + bl + "/ span 4";
        }

} 

function dodajAktivnost(raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan) {

    if(raspored == null || raspored.getElementsByClassName('kreiran').length == 0) {
        
        alert("Greška - raspored nije kreiran");
        return "Greška - raspored nije kreiran";
    }

    if(vrijemePocetak >= vrijemeKraj) {

        alert("Greška - neispravno vrijeme");
        return "Greška - neispravno vrijeme";
    }

    if(!((vrijemePocetak % 1 == 0 || vrijemePocetak % 1 == 0.5) && (vrijemeKraj % 1 == 0 || vrijemeKraj % 1 == 0.5))) {

        alert("Greška - neispravno vrijeme");
        return "Greška - neispravno vrijeme";
    }

    let poc = vrijemePocetak; 
    while(poc != vrijemeKraj) {
        //OVDJE STAVITI BACANJE ERRORA KADA IMA KOLIZIJA VREMENA

        if(raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0] == null) {

            alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
            return "Greška - već postoji termin u rasporedu u zadanom vremenu";
        }


        if(!raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0].classList.contains('prazna')) {

            alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
            return "Greška - već postoji termin u rasporedu u zadanom vremenu";
        }
        poc += 0.5;
    }

    poc = vrijemePocetak;
    let razvuci = (vrijemeKraj - vrijemePocetak) * 2;
    let celija = raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0];


     
    let prvoVrijeme = parseInt(raspored.getElementsByClassName('blank')[0].id.substring(1, 3));
    let lokacijaCelije = (vrijemePocetak - prvoVrijeme) * 2 + 5;



    while(poc != vrijemeKraj) {

        if(raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0].classList.contains('h' + vrijemePocetak)) {

            raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0].style.gridColumn = "" + lokacijaCelije + " / span " + razvuci;
            let node1 = document.createElement("naziv");
            node1.classList.add("naziv");
            let node3 = document.createElement("br");
            let node2 = document.createElement("tip");
            node2.classList.add("tip");
            
            
            let tekst1 = document.createTextNode(naziv);
            let tekst2 = document.createTextNode(tip);

            node1.appendChild(tekst1);
            node2.appendChild(tekst2);
            raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0].appendChild(node1);
            raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0].appendChild(node3);
            raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0].appendChild(node2);

            if(vrijemeKraj % 1 == 0) {

                raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0].classList.add("predmetParan");
                
            } else {

                raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0].classList.add("predmetNeparan");

            }

            raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0].classList.remove("prazna");

        } else {

            raspored.getElementsByClassName('' + raspored.id + dan + ' h' + poc)[0].remove();
        }
        poc += 0.5;

    }

}