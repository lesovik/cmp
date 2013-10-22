/*********************************************************************************************************/
/**
 * inserthtml plugin for CKEditor 3.x (Author: Lajox ; Email: lajox@19www.com)
 * version:	 1.0
 * Released: On 2009-12-11
 * Download: http://code.google.com/p/lajox
 */
/*********************************************************************************************************/

var scriptInsertCharacter =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='[char:name]';
		editor.insertHtml( '<span class="tags">'+text+'</span>' );
	}
};

//for select editor.getSelection().selectElement( editor._.elementsPath.list[0] );

var scriptInsertLineNumber =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='[line:123456]';
		editor.insertHtml( '<span class="tags">'+text+'</span>' );
	}
};

var scriptInsertCharacterStart =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='[quote]';
		editor.insertHtml( '<span class="tags">'+text+'</span>' );
	}
};
var scriptInsertCharacterStartSample =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='[center]';
		editor.insertHtml( '<span class="tags">'+text+'</span>' );
	}
};
var scriptInsertExit =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='[exit:Exit Text]';
		editor.insertHtml( '<span class="tags">'+text+'</span>' );
	}
};
var scriptInsertContinue =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='[continue]';
		editor.insertHtml( '<span class="tags">'+text+'</span>' );
	}
};

var scriptInsertNormal =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='<span class="normal">Normal Text</span>';
		editor.insertHtml( text );
	}
};

var scriptInsertChorus =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='[chorus]';
		editor.insertHtml( '<span class="tags">'+text+'</span>' );
	}
};


var scriptInsertStage =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='[stage]';
		editor.insertHtml( '<span class="tags">'+text+'</span>' );
	}
};

var number1End =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='<img src="'+CKEDITOR.basePath+'plugins/oxford_anchor/images/number1_end.gif" />';
		editor.insertHtml( text );
	}
};
var number2End =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='<img src="'+CKEDITOR.basePath+'plugins/oxford_anchor/images/number2_end.gif" />';
		editor.insertHtml( text );
	}
};

var number3End =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='<img src="'+CKEDITOR.basePath+'plugins/oxford_anchor/images/number3_end.gif" />';
		editor.insertHtml( text );
	}
};

var number4End =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='<img src="'+CKEDITOR.basePath+'plugins/oxford_anchor/images/number4_end.gif" />';
		editor.insertHtml( text );
	}
};

var number5End =
{
	canUndo : false,
	exec : function( editor )
	{
		var text='<img src="'+CKEDITOR.basePath+'plugins/oxford_anchor/images/number5_end.gif" />';
		editor.insertHtml( text );
	}
};




CKEDITOR.plugins.add('oxford',
  {
    requires: ['dialog'],
	lang : ['en'],
    init:function(editor) {
		editor.addCommand( 'script_character', scriptInsertCharacter );
		editor.ui.addButton( 'InsertCharacter',
			{
				label : 'Insert Character',
				command : 'script_character'
			});

		editor.addCommand( 'script_line_number', scriptInsertLineNumber );
		editor.ui.addButton( 'InsertLineNumber',
			{
				label : 'Insert Line Number',
				command : 'script_line_number'
			});

		editor.addCommand( 'script_character_start', scriptInsertCharacterStart );
		editor.ui.addButton( 'InsertCharacterStart',
			{
				label : 'Insert Quote',
				command : 'script_character_start'
			});

		editor.addCommand( 'script_character_start_sample', scriptInsertCharacterStartSample );
		editor.ui.addButton( 'InsertCharacterStartSample',
			{
				label : 'Insert Center Aligned Text',
				command : 'script_character_start_sample'
			});

		editor.addCommand( 'script_exit', scriptInsertExit );
		editor.ui.addButton( 'InsertExit',
			{
				label : 'Insert Exit',
				command : 'script_exit'
			});

		editor.addCommand( 'script_continue', scriptInsertContinue );
		editor.ui.addButton( 'InsertContinue',
			{
				label : 'Insert Continue',
				command : 'script_continue'
			});

		editor.addCommand( 'script_normal', scriptInsertNormal );
		editor.ui.addButton( 'InsertNormal',
			{
				label : 'Insert Normal',
				command : 'script_normal'
			});

		editor.addCommand( 'script_chorus', scriptInsertChorus );
		editor.ui.addButton( 'InsertChorus',
			{
				label : 'Insert Chorus',
				command : 'script_chorus'
			});
			

		editor.addCommand( 'script_stage', scriptInsertStage );
		editor.ui.addButton( 'InsertStage',
			{
				label : 'Insert Stage Direction',
				command : 'script_stage'
			});

		//number ends
		for (var i=1;i<=5;i++) {
			var number_end=i+'';
			editor.addCommand( 'script_number'+number_end+'_start', new CKEDITOR.dialogCommand( 'number'+number_end ) );
			editor.addCommand( 'script_number'+number_end+'_end', new CKEDITOR.dialogCommand( 'number'+number_end+'end' ) );

			var number_to_text=[];
			number_to_text.push('Insert Notes');
			number_to_text.push('Insert Names And Places');
			number_to_text.push('Insert Literary Device');
			number_to_text.push('Insert Literary Device');
			number_to_text.push('Insert Literary Device');

			editor.ui.addButton( 'InsertNumber'+number_end+'Start',
				{
					label :  number_to_text[number_end-1]+' Start',
					command : 'script_number'+number_end+'_start'
				});

			editor.ui.addButton( 'InsertNumber'+number_end+'End',
				{
					label : number_to_text[number_end-1]+' End',
					command : 'script_number'+number_end+'_end'
				});

	/*			editor.addCommand( 'script_number'+number_end+'_end',
				{
					canUndo : false,
					exec : function( editor )
					{
						var text='<img src="'+CKEDITOR.basePath+'plugins/oxford_anchor/images/number'+number_end+'_end.gif" />';
						editor.insertHtml( text );
					}
				}
			);
		editor.ui.addButton( 'InsertNumber'+number_end+'End',
				{
					label : 'Insert Number '+number_end+' End',
					command : 'script_number'+number_end+'_end'
				});*/



			CKEDITOR.dialog.add( 'number'+number_end, this.path + 'dialogs/number'+number_end+'.js' );
			CKEDITOR.dialog.add( 'number'+number_end+'end', this.path + 'dialogs/number'+number_end+'end'+'.js' );
		}
		
		//OLD ENDS
		/*editor.addCommand( 'script_number1_end',number1End);
		editor.ui.addButton( 'InsertNumber1End',
		{
			label : 'Insert Number 1 End',
			command : 'script_number1_end'
		});
		editor.addCommand( 'script_number2_end',number2End);
		editor.ui.addButton( 'InsertNumber2End',
		{
			label : 'Insert Number 2 End',
			command : 'script_number2_end'
		});
		editor.addCommand( 'script_number3_end',number3End);
		editor.ui.addButton( 'InsertNumber3End',
		{
			label : 'Insert Number 3 End',
			command : 'script_number3_end'
		});
		editor.addCommand( 'script_number4_end',number4End);
		editor.ui.addButton( 'InsertNumber4End',
		{
			label : 'Insert Number 4 End',
			command : 'script_number4_end'
		});
		editor.addCommand( 'script_number5_end',number5End);
		editor.ui.addButton( 'InsertNumber5End',
		{
			label : 'Insert Number 5 End',
			command : 'script_number5_end'
		});
*/


		/* STYLES */
		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommandBasic = function( buttonName, buttonLabel, commandName, styleDefiniton )
		{
			var style = new CKEDITOR.style( styleDefiniton );

			editor.attachStyleStateChange( style, function( state )
				{
					editor.getCommand( commandName ).setState( state );
				});

			editor.addCommand( commandName, new CKEDITOR.styleCommand( style ) );

			editor.ui.addButton( buttonName,
				{
					label : buttonLabel,
					command : commandName
				});
		};

		var config = editor.config;
		var lang = editor.lang;

		addButtonCommandBasic( 'Number1'		, 'Number 1'			, 'number1'		, config.oxfordStyles_number1 );
		addButtonCommandBasic( 'Number2'		, 'Number 2'			, 'number2'		, config.oxfordStyles_number2 );
		addButtonCommandBasic( 'Number3'		, 'Number 3'			, 'number3'		, config.oxfordStyles_number3 );
		addButtonCommandBasic( 'Number4'		, 'Number 4'			, 'number4'		, config.oxfordStyles_number4 );
		addButtonCommandBasic( 'Number5'		, 'Number 5'			, 'number5'		, config.oxfordStyles_number5 );
	}
});


CKEDITOR.config.oxfordStyles_number1 = {element : 'span', attributes : {'class': 'number1'}};
CKEDITOR.config.oxfordStyles_number2 = {element : 'span', attributes : {'class': 'number2'}};
CKEDITOR.config.oxfordStyles_number3 = {element : 'span', attributes : {'class': 'number3'}};
CKEDITOR.config.oxfordStyles_number4 = {element : 'span', attributes : {'class': 'number4'}};
CKEDITOR.config.oxfordStyles_number5 = {element : 'span', attributes : {'class': 'number5'}};

/*
 *
.cke_skin_kama .cke_button_script_line_number .cke_icon {
	background-position: 0 -400px;
}

.cke_skin_kama .cke_button_script_character_start .cke_icon {
	background-position: 0 -1216px;
}
.cke_skin_kama .cke_button_script_exit .cke_icon {
	background-position: 0 -1234px;
}
.cke_skin_kama .cke_button_script_continue .cke_icon {
	background-position: 0 -1251px;
}
.cke_skin_kama .cke_button_script_stage .cke_icon {
	background-position: 0 -1270px;
}
 */





