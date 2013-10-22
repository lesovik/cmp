/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
	config.extraPlugins = 'inserthtml,oxford,oxford_anchor';
	config.enterMode = CKEDITOR.ENTER_BR;
	config.ShiftEnterMode='br';
	config.FillEmptyBlocks=false;
	
	
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
};
