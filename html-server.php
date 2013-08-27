<?php
	/*include 'simple_html_dom.php';*/
	$html= stripslashes($_POST['html']);  //想要插入的内容
	$bg = stripslashes($_POST['bg']);
	$output = file_get_contents("build/html/output.html");  //输出的内容
	$htmlFile = fopen('build/html/output.html','w');

/*	function fun($in,$text) {
	    $start = substr($in,0,strpos($in,'>')+1);
	    return $start.$text.'</div>';
	}

	$in = '<div id="mod-template__elements" class="mod-template__wrapper">
            <div>sdfsdfsdfsd<p>sadasd</p>fsdf</div>
        </div>';
	echo fun($in,'Hi');*/

	/*$contain= getWebTag('id="mod-template__elements"','div',$output);*/
	/*echo $contain;*/
	$output = preg_replace("/(<!--start-->)([\s\S]+?)(<!--end-->)/","$1".$html."$3","$output");
	$output = preg_replace("/(<!--start-bg-->)([\s\S]+?)(<!--end-bg-->)/","$1".$bg."$3","$output");
	/*$output = preg_replace("$contain","$html","$output");*/

	/*$dom = new simplae_html_dom();*/
	echo $html;
	echo $output;
	fwrite($htmlFile,$output);
	fclose($htmlFile);
?>