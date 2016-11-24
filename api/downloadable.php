<?php
session_start();
if (empty($_SESSION["user"])) {
  header("HTTP/1.1 403 Forbidden");
  exit;
}

// extract input params sent by client
$file_id = $_POST['id'];
$file = $_FILES['file']["tmp_name"];
$file_content = file_get_contents($file);

// sanitize inputs
$file_id = preg_replace("/[^a-zA-Z0-9\._\-]/", "", $file_id);

// process params
$filename = "../data/downloadable-$file_id";

if (file_put_contents($filename, $file_content) == FALSE) {
  header("HTTP/1.1 403 Forbidden");
  exit;
}

exit;
?>

