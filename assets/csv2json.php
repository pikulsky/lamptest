#!/usr/bin/php
<?php

$raw_data = file_get_contents('led.csv');
$utf8_data = iconv('windows-1251', 'utf-8', $raw_data);  
$handle = fopen('php://memory', 'rw'); 
fwrite($handle, $utf8_data); 
fseek($handle, 0);

$json = [];

$row = 1;

// Skip header
$data = fgetcsv($handle, 0, ';');

// Convert CSV data to JSON
while (($data = fgetcsv($handle, 0, ';')) !== FALSE) {
  $row++;

  if ($data[8]) {
    $json[$data[8]] = [
      'id' => $data[0],
      'brand' => $data[1],
      'model' => $data[2],
      'P' => $data[3],
      'link' => $data[4],
      'prop5' => $data[5],
      'price_rur' => $data[6],
      'price_usd' => $data[7],
      'upc' => $data[8],
      'diameter' => $data[9],
      'height' => $data[10],
      'voltage' => $data[11],
      'base_type' => $data[12],
      'class' => $data[13],
      'type' => $data[14],
      'subtype' => $data[15],
      'matte' => $data[16],
      'lm' => $data[17],
      'ekv' => $data[18],
      'color' => $data[19],
      'age' => $data[20],
      'p' => $data[21],
      'measured' => [
        'P' => $data[22],
        'lm' => $data[23],
        'ekv' => $data[24],
        'color' => $data[25],
        'colorRange' => $data[26],
        'angle' => $data[27],
        'pulsation' => $data[28],
      ],
    ];
  }
}

fclose($handle);

$encoded = json_encode($json);

print($encoded);