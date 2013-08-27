<?php
	$img = $_FILES['bg']['name'];
	move_uploaded_file($_FILES['bg']['tmp_name'],dirname(__FILE__)."/build/img/".$img);
	$arr = getimagesize(dirname(__FILE__)."/build/img/".$img);
/*	echo "<div class=\"mod-template__bg-box\" style=\"background:url(\"".dirname(__FILE__)."/build/img/".$img."\")\" height=\"$arr[1]\" alt=\"\" />";
*/
	$a = array('name' => $img, 'height' => $arr[1]);
	echo json_encode($a);
?>