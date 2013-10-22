<?php
function isPost() {
    return $_SERVER['REQUEST_METHOD']=='POST';
}