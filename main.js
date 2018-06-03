$("#LogIn").on("click", function(e){
  $('body').prepend('<div id="overlayL"></div>');
  $('#overlayL').append('<p>Premere ESC per tornare alla schermata principale</p>');
  $('#overlayL').append('<input type=text id=username placeholder=username></input>');
  $('#overlayL').append('<input type=password id=password placeholder=password></input>');
  $('#overlayL').append('<button type=button onclick="logIn();">LogIn</button>');
});

$("#MyTeam").on("click", function(e){
  window.location.href = "paginaSquadra.html";
});

$( document ).ready(function() {
  checkLogIn();
  $('#Home').text('Home Page');
  $("#Home").on("click", function(e){
    window.location.href = "index.html";
  });
  $.ajax({
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'getLeghe'},
    dataType: 'json',
    success: function(data)
    {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
          $('#selectLega').append('<option value="' + data[i].ID + '">' + data[i].Denominazione + '</option>');
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(thrownError);
    }
  });
  updateSquadre(1);

  $(document).on('keyup',function(evt) {
      if (evt.keyCode == 27) {
         $('#overlayC').css("display", "none");
         $('#overlayL').css("display", "none");
         //fa tornare visibile l'immagine principale
         //$('#mainimg').css("display", "");
      }
  });
});

function getTrattative(){
  if (!!Cookies.get('utente')) {
    $.ajax({
      type: "POST",
      url: 'main.php',
      data: {'dataString': 'getTrattative', idUtente:Cookies.get('utente')},
      dataType: 'json',
      success: function(data)
      {
        console.log(data);
        $('#trattative').text('Hai ricevuto ' + data.length + ' trattative');
        if (data.length>0) {
          $('#trattative').append(':<br>');
          $('#trattative').append('<table id="tableTrattative">'
          +'<tr>'
            +'<td>Giocatore</td>'
            +'<td>Squadra Offerente</td>'
            +'<td>Tipologia Offerta</td>'
            +'<td>Note</td>'
          +'</tr>'
        +'</table>');
        }
        for (var i = 0; i < data.length; i++) {
            var ID_Giocatore = data[i].ID_Giocatore
            var ID_Squadra_Offerente = data[i].ID_Squadra_Offerente
            var Tipologia_Trattativa = data[i].Tipologia_Trattativa
            var note = data[i].Note
            var nomeGiocatore = getNomeGiocatore(ID_Giocatore);
            var nomeSquadra = getNomeSquadra(ID_Squadra_Offerente);
            $('#tableTrattative').append('<tr>'
              +'<td>'+nomeGiocatore[0].Nome+' '+nomeGiocatore[0].Cognome+'</td>'
              +'<td>'+nomeSquadra[0].Denominazione+'</td>'
              +'<td>'+Tipologia_Trattativa+'</td>'
              +'<td>'+note+'</td>'
            +'</tr>');
            //$('#trattative').append(ID_Giocatore + ' ' + ID_Squadra_Offerente + ' ' + Tipologia_Trattativa + ' ' + note + '<br>');
        }
        //$('#trattative').append();
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(thrownError);
      }
    });
  }
}

function getNomeGiocatore(idCalciatore){
  var tmp;
  $.ajax({
    async: false,
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'getNomeGiocatore', 'idCalciatore':idCalciatore},
    dataType: 'json',
    success: function(data)
    {
      tmp = data;
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(thrownError);
    }
  });
  return tmp;
}

function getNomeSquadra(idSquadra){
  var tmp;
  $.ajax({
    async: false,
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'getNomeSquadra', 'idSquadra':idSquadra},
    dataType: 'json',
    success: function(data)
    {
      tmp = data;
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(thrownError);
    }
  });
  return tmp;
}

function updateSquadre(idSquadra) {
  $('#selectSquadra').empty();
  $.ajax({
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'getSquadre', 'idLega':idSquadra},
    dataType: 'json',
    success: function(data)
    {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
          $('#selectSquadra').append('<option value="' + data[i].ID + '">' + data[i].Denominazione + '</option>');
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(thrownError);
    }
  });
}

function getGiocatori() {
  var contentToRemove = document.querySelectorAll("#Giocatore");
  $(contentToRemove).remove();
  var squadra = $('#selectSquadra option:selected').val();
  $.ajax({
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'getGiocatori', 'idSquadra':squadra},
    dataType: 'json',
    success: function(data)
    {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
          addGiocatore(data[i].ID, data[i].Nome, data[i].Cognome, data[i].DataDiNascita, data[i].Ruolo)
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(thrownError);
    }
  });
  $('#mainimg').css("display", "none");
}

function addGiocatore(ID, nome, cognome, dataDiNascita, ruolo){
  $('#containerGiocatori').append(
    '<div id="Giocatore" data-id="'+ID+'">'
      +'<img id="FotoGiocatore" src="football-icon.png">'+'<br>'
      +'Nome:'+nome+'<br>'
      +'Cognome:'+cognome+'<br>'
      +'Data di Nascita:'+dataDiNascita+'<br>'
      +'Ruolo:'+ruolo
    +'</div>');

  $('[id^="Giocatore"]').unbind('click').click(function(e){
     $('body').prepend('<div id="overlayC"></div>');
     getStatistiche($(this).attr('data-id'));
  });
}

function getStatistiche(idGiocatore){
  //query che prende le statistiche dal Giocatore
  $.ajax({
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'getStatistiche', 'idGiocatore':idGiocatore},
    dataType: 'json',
    success: function(data)
    {
      console.log(data);
      appendStatistiche(data);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(thrownError);
    }
  });
}

function createTableStatistiche(){
  if (!!Cookies.get('utente')) {
   var idSquadra = Cookies.get('utente');
  }
  //query che prende le statistiche dei giocatori di una squadra
  $.ajax({
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'getStatisticheSquadra', 'idSquadra':idSquadra},
    dataType: 'json',
    success: function(data)
    {
      console.log(data);
      data.forEach(function(entry) {
        $('#tableStatistiche').append(
          '<tr id="'+entry.ID_Calciatore+'">'
            +'<td id="Nome">'+entry.Nome + ' ' + entry.Cognome+'</td>'
            +'<td id="Presenze" contenteditable="true">'+entry.Presenze+'</td>'
            +'<td id="Gol" contenteditable="true">'+entry.Gol+'</td>'
            +'<td id="Assist" contenteditable="true">'+entry.Assist+'</td>'
            +'<td id="Rigori" contenteditable="true">'+entry.Rigori+'</td>'
            +'<td id="Minuti_Giocati" contenteditable="true">'+entry['Minuti Giocati']+'</td>'
            +'<td id="Cartellini_Gialli" contenteditable="true">'+entry['Cartellini Gialli']+'</td>'
            +'<td id="Cartellini_Rossi" contenteditable="true">'+entry['Cartellini Rossi']+'</td>'
            +'<td id="Gol_Subiti" contenteditable="true">'+entry['Gol Subiti']+'</td>'
            +'<td><input type="submit" value="Aggiorna" onclick="aggiornaStatistiche('+entry.ID_Calciatore+')"></input></td>'
          +'</tr>'
        );
      });
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(thrownError);
    }
  });
}

function aggiornaStatistiche(idCalciatore){
  var presenze = ($('tr#'+idCalciatore+' td#Presenze').text());
  var gol = ($('tr#'+idCalciatore+' td#Gol').text());
  var assist = ($('tr#'+idCalciatore+' td#Assist').text());
  var rigori = ($('tr#'+idCalciatore+' td#Rigori').text());
  var minuti = ($('tr#'+idCalciatore+' td#Minuti_Giocati').text());
  var cartelliniGialli = ($('tr#'+idCalciatore+' td#Cartellini_Gialli').text());
  var cartelliniRossi = ($('tr#'+idCalciatore+' td#Cartellini_Rossi').text());
  var golSubiti = ($('tr#'+idCalciatore+' td#Gol_Subiti').text());
  $.ajax({
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'aggiornaStatistiche', 'idCalciatore':idCalciatore, 'presenze':presenze, 'gol':gol, 'assist':assist, 'rigori':rigori,
           'minuti':minuti, 'cartelliniGialli':cartelliniGialli, 'cartelliniRossi':cartelliniRossi, 'golSubiti':golSubiti},
    dataType: 'json',
    success: function(data)
    {
      console.log(data);
      $('#aggiornamentoStatistiche').text("Statistiche aggiornate con successo!");
    },
    error: function (e) {
      obj = JSON.parse(e.responseText);
      console.log(obj.messaggio);
    }
  });
}

function appendStatistiche(data){
  var statistiche = '<div id="Statistiche">'
    +'<p>Premere ESC per tornare alla schermata principale</p>'+'<br>'
    +'Presenze:'+data[0].Presenze+'<br>'
    +'Gol:'+data[0].Gol+'<br>'
    +'Assist:'+data[0].Assist+'<br>'
    +'Rigori:'+data[0].Rigori+'<br>'
    +'Minuti giocati:'+data[0]['Minuti Giocati']+'<br>'
    +'Cartellini gialli:'+data[0]['Cartellini Gialli']+'<br>'
    +'Cartellini rossi:'+data[0]['Cartellini Rossi']+'<br>'
    +'Gol subiti:'+data[0]['Gol Subiti']+'<br>';
    if (!!Cookies.get('utente')) {
     statistiche += '<input type="submit" value="Richiedi informazioni" onclick="showFormTrattativa('+data[0].ID_Calciatore+');"></input>';
    }
    statistiche += '</div>';
  $('#overlayC').append(statistiche);
}

function showFormTrattativa(data){
  var formTrattativa = '<div id="Statistiche">'
    +'<select id="tipologiaRichiesta">'
      +'<option value="prestito">Prestito</option>'
      +'<option value="trasferimento">Trasferimento</option>'
    +'</select>'+'<br>'
    +'<textarea rows="4" cols="50" id="note" placeholder="Insersci qui una breve descrizione della tua offerta"></textarea>'+'<br>'
    +'<input type="submit" value="Invia Richiesta" onclick="richiediInformazioni('+data+');">'
  +'</div>'
  +'<br>';
  $('#overlayC').append(formTrattativa);
}

function richiediInformazioni(idCalciatore){
  var idSquadra = Cookies.get('utente');
  var tipologiaRichiesta = $('#tipologiaRichiesta').find(":selected").text();
  var note = $('#note').val();
  //Inserisce una richiesta di informazioni nel database
  $.ajax({
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'insertTrattativa', 'idSquadraOfferente':idSquadra, 'idGiocatore':idCalciatore, 'tipologiaRichiesta':tipologiaRichiesta, 'note':note},
    dataType: 'json',
    success: function(data)
    {
      console.log(data);
      $('#overlayC').css("display", "none");
    },
    error: function (e) {
      obj = JSON.parse(e.responseText);
      console.log(obj.messaggio);
    }
  });
}

function logIn(){
  var username = $('#username').val();
  var password = $('#password').val();
  $.ajax({
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'logIn', 'username':username, 'password':password},
    dataType: 'json',
    success: function(data)
    {
      window.location.href = "paginaSquadra.html";
      console.log(data);
    },
    error: function (e) {
      obj = JSON.parse(e.responseText);
      console.log(obj.messaggio);
    }
  });
}

function checkLogIn(){
  $.ajax({
    type: "POST",
    url: 'main.php',
    data: {'dataString': 'checkLogIn'},
    dataType: 'json',
    success: function(data)
    {
      $('.login').text('LogOut');
      $('#LogIn').attr('id','LogOut');
      $('#MyTeam').text('La mia squadra');
      $('#LogOut').unbind('click').click(function(f){
        logOut();
      });
    },
    error: function (e) {

    }
  });
}

function logOut(){
      Cookies.remove('utente');
      window.location.href = "index.html";
}

function createCookie(name,value,days) {
  if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
  }
  else {var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  }
}
