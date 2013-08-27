<?php
	$style = stripslashes($_POST['contain']);
	$styleFile = fopen('build/css/style.css','w');
	fwrite($styleFile,$style);
	fclose($styleFile);
?>