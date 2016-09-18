<?php
session_start();
if (empty($_SESSION["user"])) {
  header("HTTP/1.1 403 Forbidden");
  exit;
}

// extract input params sent by client
$picture_id = $_POST['id'];
$picture_content = file_get_contents($_FILES['file']["tmp_name"]);

$filename = "../data/img-$picture_id.jpg"; // TODO - sanitize this

// write the content
file_put_contents($filename, $picture_content);
exit;

?>

