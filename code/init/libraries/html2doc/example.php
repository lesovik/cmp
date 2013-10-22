<?php
	include 'html2doc.php';
	
	$htmltodoc= new HTML_TO_DOC();
	$htmltodoc->createDocFromURL('http://www.yahoo.com/','test');
?>