<?php
	$img = $_FILES['image']['name'];
	move_uploaded_file($_FILES['image']['tmp_name'],dirname(__FILE__)."/build/img/".$img);
	echo $img;
?>