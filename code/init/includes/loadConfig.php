<?php
mysql_connect($host, $user, $password);
mysql_select_db($database_name);
$sql = "select * from `core_constant` ";
$rs=mysql_query($sql) or die($sql." ".mysql_error());
while ($row = mysql_fetch_assoc($rs)) {
    $name = $row['name'];
    $lname = strtoupper($name);
    switch ($row['type']) {
        case 'Integer': $value = (int)$row['value'];
            break;
        case 'Boolean':
            switch (strtolower($row['value'])) {
                case 'true':
                case 1:
                    $value=true;
                    break;
                case 'false':
                case 0:
                default:
                    $value=false;
                    break;
            }
            break;
        default:case 'String': $value = $row['value'];
            break;
        case 'Float': $value = (float)$row['value'];
            break;
        case 'Serialized Array':
            $value = @unserialize($row['value']);
            if (!$value) $value=$row['value'];
            break;
    }
    if (!is_array($value)) {
        define("{$lname}", $value);
    }

}