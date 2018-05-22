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

  try {
      $conn = new PDO("mysql:host=$servername;dbname=tesina_sala", $username, $password);
      // set the PDO error mode to exception
      $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      error_log("Connected successfully", 3, "logs/info.log");
      // preparazione della query
      $sql = $conn->prepare('SELECT * FROM lega');

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
