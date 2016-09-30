<?php
  $adm_user = "admin";
  $adm_pw = "secret";
  
  session_start();

  // already logged in
  if (!empty($_SESSION["user"])) {
    echo $_SESSION['user'];
    exit;
  }

  // not yet logged in
  if ($_SERVER['PHP_AUTH_USER'] != $adm_user || $_SERVER['PHP_AUTH_PW'] != $adm_pw) {
    header("HTTP/1.1 401 Unauthorized");
    session_destroy();
    exit;
  }

  // now logged in
  $_SESSION['user'] = $_SERVER['PHP_AUTH_USER'];
  echo $_SERVER['PHP_AUTH_USER'];
?>

