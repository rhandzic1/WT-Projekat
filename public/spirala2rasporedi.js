


let x = document.getElementById("sati");

iscrtajRaspored(x, ['Ponedjeljak','Utorak','Srijeda','Četvrtak', 'Petak'], 7, 21);
dodajAktivnost(x, "WT","predavanje",9,12,"Ponedjeljak");
dodajAktivnost(x, "WT","vjezbe",12,13.5,"Ponedjeljak");
dodajAktivnost(x, "RMA","predavanje",14,17,"Ponedjeljak");
dodajAktivnost(x, "OOI","predavanje",14,17,"Ponedjeljak");

dodajAktivnost(x, "RMA","vjezbe",12.5,14,"Utorak");
dodajAktivnost(x, "DM","tutorijal",14,16,"Utorak");

dodajAktivnost(x, "Neki","tutorijal",15,17,"Utorak");
dodajAktivnost(x, "DM","predavanje",16,19,"Utorak");
dodajAktivnost(x, "OI","predavanje",12.4,15,"Srijeda");


let y = document.getElementById("sati2");
iscrtajRaspored(y, ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 6, 23);
dodajAktivnost(y,'WT','predavanje',8 ,12 ,'Ponedjeljak');
dodajAktivnost(y,'WT','predavanje',12 ,15 ,'Ponedjeljak');
dodajAktivnost(y, 'RMA', 'predavanje', 15, 17, 'Ponedjeljak');
dodajAktivnost(y,'WT','tutorijal',12,14,'Utorak');
dodajAktivnost(y, 'NA', 'predavanje', 12, 15.5, 'Petak');

let z = document.getElementById("sati3");
iscrtajRaspored(z, ['Ponedjeljak','Utorak','Srijeda','Četvrtak', 'Petak', 'Subota', 'Nedjelja'], 17, 24);
dodajAktivnost(z, "Aktivnost1", "vrsta", 17, 24, "Ponedjeljak");
dodajAktivnost(z, "Aktivnost1", "vrsta", 17, 24, "Utorak");
dodajAktivnost(z, "Aktivnost1", "vrsta", 17, 24, "Srijeda");

let w = document.getElementById("sati4");
iscrtajRaspored(w, ['Ponedjeljak','Utorak','Srijeda','Četvrtak', 'Petak', 'Subota', 'Nedjelja'], 17, 24);


