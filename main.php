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
      }
      // esecuzione della query
      $sql->execute();

      // creazione di un array dei risultati
      $res = $sql->fetchAll();
      }
  catch(PDOException $e)
      {
      error_log("Connection failed: " . $e->getMessage(), 3, "logs/info.log");
      }
echo json_encode($res);
?>
