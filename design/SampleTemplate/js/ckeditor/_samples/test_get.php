<?php
$data=array(1=>array('apples','Apples are good'),2=>array('bananas','Bananas are great'),3=>array('oranges','Oranges grow on trees'),4=>array('Zupples','Tasty'));
?>
<label>Suggestions:</label>
<?if ($data): ?>
<ul>
	<?foreach ($data as $key=>$data_item): ?>
		<li class="<?='def'.$key==$_GET['sel']?'selected_suggestion':'' ?>" id="lidef<?=$key ?>">
			<a href="#" onclick="removeClassesFromElements('selected_suggestion');document.getElementById('lidef<?=$key ?>').className='selected_suggestion';document.getElementById('liover<?=$key ?>').className='';document.getElementById('<?=htmlentities($_GET['id']) ?>').value='<?=addslashes(htmlentities($data_item[0],ENT_COMPAT,'UTF-8')) ?>';document.getElementById('<?=htmlentities($_GET['id2']) ?>').value='def<?=addslashes(htmlentities($key,ENT_COMPAT,'UTF-8')) ?>';"><?=htmlentities($data_item[0],ENT_COMPAT,'UTF-8') ?></a>
			<br />
			<span id="liover<?=$key ?>" class="hide_over"><?=$data_item[1] ?></span>
		</li>
	<?endforeach; ?>
</ul>
<?endif; ?>