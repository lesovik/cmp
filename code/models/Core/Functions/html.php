<?php
/**
  * Overwrite the return type
  *
  * @return html_object
  */
function html($tag)
{
    return new html_object($tag);
}
function html_pack($tag)
{
}