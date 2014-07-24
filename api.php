<?php

/**
 *
 * This file simply scans a directory and returns its contents as a
 * JSON blob. Useful for JS thingies.
 *
 **/

/* Settings */
$directory = 'gifs';
$allowed_file_types = array(
  'jpg',
  'jpeg',
  'gif',
  'png'
);

/* Get files */
$files = scandir($directory);

/* Remove all things not in $allowed_file_types */
foreach($files as $key => $value) {
  $extension = strtolower(pathinfo($value, PATHINFO_EXTENSION));
  if(!in_array($extension, $allowed_file_types)) {
    unset($files[$key]);
  }
}

/* Rebuild $files keys */
$files = array_values($files);

/* Add some useful metadata */
$json_array = array(
  'count' => count($files),
  'file_directory' => $directory,
  'files' => $files
);

/* Encode to json and print */
$json_object = json_encode($json_array);
//print '<pre>' . print_r($json_array, 1) . '</pre>';
print $json_object;