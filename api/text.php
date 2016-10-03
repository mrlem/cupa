<?php

// extract input params sent by client
$text_id = $_POST['id'];
$text_content = isset($_POST['text']) ? $_POST['text'] : null;

// sanitize inputs
$text_id = preg_replace("/[^a-zA-Z0-9\._\-]/", "", $text_id);

$filename = "../data/text-$text_id.txt";

// read the content
if ($text_content == null) {
  if (!file_exists($filename)) {
    header("HTTP/1.1 204 No Content");
    exit;
  }
  $text_content = file_get_contents($filename);
  echo $text_content;
}
// write the content, if admin
else {
  session_start();
  if (empty($_SESSION["user"])) {
    header("HTTP/1.1 403 Forbidden");
    exit;
  }

  if (file_put_contents($filename, $text_content) == FALSE) {
    header("HTTP/1.1 403 Forbidden");
    exit;
  }
}
exit;
?>
