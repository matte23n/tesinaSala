<?php

  //--------------------------------------------------------------------------
  // Example php script for fetching data from mysql database
  //--------------------------------------------------------------------------

  $databaseName = "tesina_sala";
  $tableName = "calciatori";

  //--------------------------------------------------------------------------
  // 1) Connect to mysql database
  //--------------------------------------------------------------------------
  $servername = "localhost";
  $username = "root";
  $password = "";

  $stringData = $_POST['dataString'];

  try {
      $conn = new PDO("mysql:host=$servername;dbname=tesina_sala", $username, $password);
      // set the PDO error mode to exception
      $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // preparazione della query
      switch($stringData){
        case 'getLeghe':
          $sql = $conn->prepare('SELECT * FROM lega');
          break;
        case 'getAllSquadre':
          $sql = $conn->prepare('SELECT * FROM squadra');
          break;
        case 'getSquadre':
          $ID_Lega = $_POST['idLega'];
          $sql = $conn->prepare('SELECT squadra.ID, squadra.Denominazione FROM squadra WHERE squadra.ID_Lega=:idLega');
          $sql->bindParam(':idLega', $ID_Lega);
          break;
        case 'getGiocatori':
          $ID_Squadra = $_POST['idSquadra'];
          $sql = $conn->prepare('SELECT * FROM Calciatori WHERE Calciatori.ID_Squadra=:idSquadra');
          $sql->bindParam(':idSquadra', $ID_Squadra);
          break;
        case 'getStatistiche':
          $ID_Giocatore = $_POST['idGiocatore'];
          $sql = $conn->prepare('SELECT * FROM statistiche WHERE ID_Calciatore=:idGiocatore');
          $sql->bindParam(':idGiocatore', $ID_Giocatore);
          break;
        case 'logIn':
          $usernameUtente = $_POST['username'];
          $passwordUtente = $_POST['password'];
          $sql = $conn->prepare('SELECT * FROM utenti where Username=:username');
          $sql->bindParam(':username', $usernameUtente);
          $sql->execute();
          $res = $sql->fetch();
          // $nome = $res['Nome'];
          // $cognome = $res['Cognome'];
          // $utente = $nome." ".$cognome;
          $idUtente = $res['ID'];
          $password = $res['Password'];
          if ($password == $passwordUtente) {
            echo json_encode(array('messaggio' => 'success'));
            setcookie('utente', $idUtente, time() + (864000 * 30), "/");
          }
          else {
              $message = "Password errata!!";
              die(json_encode(array('messaggio' => $message))) ;
          }
          break;
        case 'checkLogIn':
          if(isset($_COOKIE['utente'])) {
            echo json_encode(array('messaggio' => 'success'));
          }
          break;
          //dehash password
          /*$hash = $row['password'];
          if(password_verifY($password, $hash)){
              //echo "password giusta";
              echo json_encode(array('messaggio' => 'success'));
              setcookie('utente', $utente, time() + (864000 * 30), "/");
          }
          else {
              //echo "password sbagliata";
              $message = "Password errata!!";
              header('HTTP/1.1 500');
              die(json_encode(array('messaggio' => $message))) ;
          }*/
        case 'insertTrattativa':
          $ID_Giocatore = $_POST['idGiocatore'];
          $ID_Utente = $_POST['idUtente'];
          $sqlIDSquadra = $conn->prepare('SELECT ID_Squadra FROM utenti WHERE ID=:idUtente');
          $sqlIDSquadra->bindParam(':idUtente', $ID_Utente);
          $sqlIDSquadra->execute();
          $resSquadra = $sqlIDSquadra->fetch();
          $ID_Squadra_Offerente = $resSquadra['ID_Squadra'];
          $sqlSquadra = $conn->prepare('SELECT ID_Squadra FROM calciatori WHERE ID=:idGiocatore');
          $sqlSquadra->bindParam(':idGiocatore', $ID_Giocatore);
          $sqlSquadra->execute();
          $res = $sqlSquadra->fetch();
          $ID_Squadra_Ricevente = $res['ID_Squadra'];
          $tipologiaRichiesta = $_POST['tipologiaRichiesta'];
          $note = $_POST['note'];
          $sql = $conn->prepare('INSERT INTO trattative VALUES ("", :idGiocatore, :idSquadraOfferente, :idSquadraRicevente, :tipologiaRichiesta, :note)');
          $sql->bindParam(':idGiocatore', $ID_Giocatore);
          $sql->bindParam(':idSquadraOfferente', $ID_Squadra_Offerente);
          $sql->bindParam(':idSquadraRicevente', $ID_Squadra_Ricevente);
          $sql->bindParam(':tipologiaRichiesta', $tipologiaRichiesta);
          $sql->bindParam(':note', $note);
          break;
      }
      if ($stringData != 'logIn' && $stringData != 'checkLogIn') {
        // esecuzione della query
        $executed = $sql->execute();

        if ($stringData != 'insertTrattativa') {
          // creazione di un array dei risultati
          $res = $sql->fetchAll();
          echo json_encode($res);
        }
        else{
          if ($executed === TRUE) {
            echo json_encode($executed);
          }
        }
      }
  }
  catch(PDOException $e){
    error_log("Connection failed: " . $e->getMessage(), 3, "logs/info.log");
  }
?>
