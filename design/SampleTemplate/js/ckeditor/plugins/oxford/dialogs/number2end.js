

CKEDITOR.dialog.add( 'number2end', function( editor )
      {
		  var root_selection;
		  var root_element;
		  var must_insert;
		  var start_selection;


		  // Function called in onShow to load selected element.
			var loadElements = function( editor, selection, element )
			{
				this.editMode = true;
				this.editObj = element;


				document.getElementById('id_field').value=this.editObj.getAttribute('rel');
				var attributeValue = this.editObj.getAttribute( 'dname' );

				if ( attributeValue )
					this.setValueOf( 'info','txtName', attributeValue );
				else
					this.setValueOf( 'info','txtName', "" );



				//alert(this.editObj.getAttribute('id'));


			};



          return {
              title : 'Edit Definition',
              resizable : CKEDITOR.DIALOG_RESIZE_BOTH,
              minWidth : 300,
			  minHeight : 60,
              contents : [
					{
						id : 'info',
						label : 'Find Definition:',
						accessKey : 'I',
						elements :
						[
							{
								type : 'text',
								id : 'txtName',
								label : 'Find Definition:',
								required: true,
								onKeyUp:function(){
									var book_id=editor.config.hidden_id_value;
									if (this.getValue()) {
										var element_to_update = document.getElementById( 'suggestions' );
										EAJAX.load( '/ajax?test='+this.getValue()+'&id='+this.getInputElement().$.id+'&id2='+'id_field'+'&sel='+document.getElementById('id_field').value+'&book_id='+book_id,function( data ) {
											element_to_update.innerHTML=data;
										} );

									}
									//alert(this.getValue());
								},
								onChange:function(){
									var book_id=editor.config.hidden_id_value;
									if (this.getValue()) {
										var element_to_update = document.getElementById( 'suggestions' );
										EAJAX.load( '/ajax?test='+this.getValue()+'&id='+this.getInputElement().$.id+'&id2='+'id_field'+'&sel='+document.getElementById('id_field').value+'&book_id='+book_id,function( data ) {
											element_to_update.innerHTML=data;
										} );
									}

									//alert(this.getValue());
								},
								validate : function()
								{
									if ( !this.getValue() )
									{
										alert( 'Please type in a definition');
										return false;
									}
									return true;
								}
							},
							{
								type:'html',
								id : 'info2',
								label : 'Use Definition:',
								html:'<div id="suggestions"></div><input type="hidden" id="id_field" />'
							}
						]
					}
				],

			  //events
			  onShow : function()
				{
				document.getElementById('id_field').value='';
			//ajax test
			//var data = EAJAX.load( '/ajax' );
			//alert( data );


					//check for edits/special inserts
					var selection = editor.getSelection();
					root_element = selection.getSelectedElement();

					if (CKEDITOR.env.ie) {
					   root_selection = editor.getSelection().document.$.selection.createRange().text+'';
					} else {
					   root_selection  = editor.getSelection().getNative()+'';
					}
					must_insert=!root_element && root_selection  && root_selection!='';


					this.editObj = false;
					this.fakeObj = false;
					this.editMode = false;

					var selection = editor.getSelection();
					var element = selection.getSelectedElement();
					/*if ( element && element.getAttribute( '_cke_real_element_type' ) && element.getAttribute( '_cke_real_element_type' ) == 'oxford_anchor' )
					{
						this.fakeObj = element;
						element = editor.restoreRealElement( this.fakeObj );
						loadElements.apply( this, [ editor, selection, element ] );
						selection.selectElement( this.fakeObj );
					}*/
					if (element) {
						loadElements.apply( this, [ editor, selection, element ] );
					}else {
						if (CKEDITOR.env.ie) {
						   selection = editor.getSelection().document.$.selection.createRange().text;
						} else {
						   selection  = editor.getSelection().getNative();
						}
						if (selection) {
							this.setValueOf( 'info','txtName', selection );
						}
					}

					this.getContentElement( 'info', 'txtName' ).focus();


				},
			  onOk : function()
				{

					if (!document.getElementById('id_field').value) {
						alert('Please select a definition to use');
						return false;
					}

					var name = this.getValueOf( 'info', 'txtName' );

					if (root_element && root_element.getAttribute( 'dname' ) && root_element.getAttribute( 'rel' )) {
						root_element.setAttribute('dname',name);
						root_element.setAttribute('rel',document.getElementById('id_field').value);
						return true;
					}


					// Always create a new anchor, because of IE BUG.

					var element = CKEDITOR.env.ie ?
						editor.document.createElement( '<img src="'+CKEDITOR.basePath+'plugins/oxford_anchor/images/number2_end.gif" class="number2_end" dname="' + CKEDITOR.tools.htmlEncode( name ) + '" rel="'+document.getElementById('id_field').value+'" />' ) :
						editor.document.createElement( 'img' );

					// Move contents and attributes of old anchor to new anchor.
					if ( this.editMode )
					{
						this.editObj.copyAttributes( element, {name : 1} );
						this.editObj.moveChildren( element );
					}

					// Set name.
					//element.removeAttribute( '_cke_saved_name' );
					element.setAttribute( 'dname', name );
					element.setAttribute( 'class', 'number2_end' );
					element.setAttribute( 'rel', document.getElementById('id_field').value );
					element.setAttribute( 'src', ''+CKEDITOR.basePath+'plugins/oxford_anchor/images/number2_end.gif' );




					// Insert a new anchor.
					//var fakeElement = editor.createFakeElement( element, 'cke_oxford_anchor', 'oxford_anchor' );
					//
					//if ( !this.editMode )
					if (must_insert) {
						editor.insertText( root_selection );
					}
					editor.insertElement( element );
					//else
					//{
					//	fakeElement.replace( this.fakeObj );
//						editor.getSelection().selectElement( fakeElement );
					//}

					return true;
				}
          };
      });