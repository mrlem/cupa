<?php
session_start();
if (empty($_SESSION["user"])) {
  header("HTTP/1.1 403 Forbidden");
  exit;
}

// constants
$max_size = 800;

// extract input params sent by client
$picture_id = $_POST['id'];
$picture_width = $_POST['width'];
$picture_height = $_POST['height'];
$picture = $_FILES['file']["tmp_name"];
$picture_content = file_get_contents($picture);

// sanitize inputs
$picture_id = preg_replace("/[^a-zA-Z0-9\._\-]/", "", $picture_id);

if (!is_numeric($picture_width)) {
  $picture_width = null;
}
else {
  $picture_width += 0;
}
if (!is_numeric($picture_height)) {
  $picture_height = null;
}
else {
  $picture_height += 0;
}

// process params
$filename = "../data/img-$picture_id.jpg";

// analyze image
list($real_width, $real_height, $type, $attr) = getimagesize($picture);
if (($picture_width == null || $real_width == $picture_width) && ($picture_height == null || $real_height == $picture_height)) {
  // no html constraint: write image directly
  if (file_put_contents($filename, $picture_content) == FALSE) {
    header("HTTP/1.1 403 Forbidden");
    exit;
  }
}
else {
  // html constraints: resize image
  $ratio = $real_width/$real_height;

  // apply html constraints, if any
  if ($picture_width != null && $picture_height != null) {
    // html constraints override ratio
    $ratio = $picture_width/$picture_height;
  }
  else if ($picture_width == null) {
    $picture_width = $picture_height * $ratio;
  }
  else if ($picture_height == null) {
    $picture_height = $picture_width / $ratio;
  }
  
  // apply max bounds
  if ($ratio > 1) {
    $picture_width = min($picture_width, $max_size);
    $picture_height = $picture_width / $ratio;
  }
  else {
    $picture_height = min($picture_height, $max_size);
    $picture_width = $picture_height * $ratio;
  }

  // round
  $picture_width = ceil($picture_width);
  $picture_height = ceil($picture_height);

  // proceed with resize
  $src = imagecreatefromstring($picture_content);
  $dst = imagecreatetruecolor($picture_width, $picture_height);
  imagecopyresampled($dst, $src, 0, 0, 0, 0, $picture_width, $picture_height, $real_width, $real_height);
  imagedestroy($src);
  if (imagejpeg($dst, $filename) == FALSE) {
    header("HTTP/1.1 403 Forbidden");
    exit;
  }
}

exit;
?>

