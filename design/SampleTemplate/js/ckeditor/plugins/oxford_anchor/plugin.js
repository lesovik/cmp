function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

function removeClassesFromElements(class_to_remove)
{
	var found_classes=getElementsByClass(class_to_remove,document.getElementById('suggestions'));
	for (var i=0;i<found_classes.length;i++) {
		found_classes[i].className='';
	}

}

/*JSON START */
/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());



/*JSON END */


EAJAX = (function()
{
	var createXMLHttpRequest = function()
	{
		// In IE, using the native XMLHttpRequest for local files may throw
		// "Access is Denied" errors.
		if ( !CKEDITOR.env.ie || location.protocol != 'file:' )
			try { return new XMLHttpRequest(); } catch(e) {}

		try { return new ActiveXObject( 'Msxml2.XMLHTTP' ); } catch (e) {}
		try { return new ActiveXObject( 'Microsoft.XMLHTTP' ); } catch (e) {}

		return null;
	};

	var checkStatus = function( xhr )
	{
		// HTTP Status Codes:
		//	 2xx : Success
		//	 304 : Not Modified
		//	   0 : Returned when running locally (file://)
		//	1223 : IE may change 204 to 1223 (see http://dev.jquery.com/ticket/1450)

		return ( xhr.readyState == 4 &&
				(	( xhr.status >= 200 && xhr.status < 300 ) ||
					xhr.status == 304 ||
					xhr.status === 0 ||
					xhr.status == 1223 ) );
	};

	var getResponseText = function( xhr )
	{
		if ( checkStatus( xhr ) )
			return xhr.responseText;
		return null;
	};

	var getResponseXml = function( xhr )
	{
		if ( checkStatus( xhr ) )
		{
			var xml = xhr.responseXML;
			return new CKEDITOR.xml( xml && xml.firstChild ? xml : xhr.responseText );
		}
		return null;
	};

	var load = function( url, callback, getResponseFn )
	{
		var async = !!callback;

		var xhr = createXMLHttpRequest();

		if ( !xhr )
			return null;

		xhr.open( 'GET', url, async );

		if ( async )
		{
			// TODO: perform leak checks on this closure.
			/** @ignore */
			xhr.onreadystatechange = function()
			{
				if ( xhr.readyState == 4 )
				{
					callback( getResponseFn( xhr ) );
					xhr = null;
				}
			};
		}

		xhr.send(null);

		return async ? '' : getResponseFn( xhr );
	};

	return 	/** @lends CKEDITOR.ajax */ {

		/**
		 * Loads data from an URL as plain text.
		 * @param {String} url The URL from which load data.
		 * @param {Function} [callback] A callback function to be called on
		 *		data load. If not provided, the data will be loaded
		 *		asynchronously, passing the data value the function on load.
		 * @returns {String} The loaded data. For asynchronous requests, an
		 *		empty string. For invalid requests, null.
		 * @example
		 * // Load data synchronously.
		 * var data = CKEDITOR.ajax.load( 'somedata.txt' );
		 * alert( data );
		 * @example
		 * // Load data asynchronously.
		 * var data = CKEDITOR.ajax.load( 'somedata.txt', function( data )
		 *     {
		 *         alert( data );
		 *     } );
		 */
		load : function( url, callback )
		{
			return load( url, callback, getResponseText );
		},

		/**
		 * Loads data from an URL as XML.
		 * @param {String} url The URL from which load data.
		 * @param {Function} [callback] A callback function to be called on
		 *		data load. If not provided, the data will be loaded
		 *		asynchronously, passing the data value the function on load.
		 * @returns {CKEDITOR.xml} An XML object holding the loaded data. For asynchronous requests, an
		 *		empty string. For invalid requests, null.
		 * @example
		 * // Load XML synchronously.
		 * var xml = CKEDITOR.ajax.loadXml( 'somedata.xml' );
		 * alert( xml.getInnerXml( '//' ) );
		 * @example
		 * // Load XML asynchronously.
		 * var data = CKEDITOR.ajax.loadXml( 'somedata.xml', function( xml )
		 *     {
		 *         alert( xml.getInnerXml( '//' ) );
		 *     } );
		 */
		loadXml : function( url, callback )
		{
			return load( url, callback, getResponseXml );
		}
	};
})();



CKEDITOR.plugins.add( 'oxford_anchor',
{
	init : function( editor )
	{
		// Add the oxford_link and unoxford_link buttons.
		editor.addCommand( 'oxford_link', new CKEDITOR.dialogCommand( 'oxford_link' ) );
		editor.addCommand( 'oxford_anchor', new CKEDITOR.dialogCommand( 'oxford_anchor' ) );
		editor.addCommand( 'unoxford_link', new CKEDITOR.unoxford_linkCommand() );
		editor.ui.addButton( 'OxfordLink',
			{
				label : 'Oxford Link',
				command : 'oxford_link'
			} );
		editor.ui.addButton( 'Unoxford_link',
			{
				label : 'Oxford Unlink',
				command : 'unoxford_link'
			} );
		editor.ui.addButton( 'Oxford Anchor',
			{
				label : 'Oxford Anchor',
				command : 'oxford_anchor'
			} );
		CKEDITOR.dialog.add( 'oxford_link', this.path + 'dialogs/oxford_link.js' );
		CKEDITOR.dialog.add( 'oxford_anchor', this.path + 'dialogs/oxford_anchor.js' );

		// Add the CSS styles for oxford_anchor placeholders.
		editor.addCss(
			'img.cke_oxford_anchor' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/oxford_anchor.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'width: 20px;' +
				'height: 10px;' +
			'}\n' +
			'span.cke_oxford_anchor' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/oxford_anchor.gif' ) + ');' +
				'background-position: 0 center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'padding-left: 18px;' +
				'display:inline-block;' +
			'}'
		   	);

		// Register selection change handler for the unoxford_link button.
		 editor.on( 'selectionChange', function( evt )
			{
				/*
				 * Despite our initial hope, document.queryCommandEnabled() does not work
				 * for this in Firefox. So we must detect the state by element paths.
				 */
				var command = editor.getCommand( 'unoxford_link' ),
					element = evt.data.path.lastElement.getAscendant( 'span', true );
				if ( element && element.getName() == 'span' && element.getAttribute( 'href' ) )
					command.setState( CKEDITOR.TRISTATE_OFF );
				else
					command.setState( CKEDITOR.TRISTATE_DISABLED );
			} );

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems )
		{
			editor.addMenuItems(
				{
					oxford_anchor :
					{
						label : 'Oxford Anchor',
						command : 'oxford_anchor',
						group : 'oxford_anchor'
					},

					oxford_link :
					{
						label : 'Oxford Link',
						command : 'oxford_link',
						group : 'oxford_link',
						order : 1
					},

					unoxford_link :
					{
						label : 'Oxford Unlink',
						command : 'unoxford_link',
						group : 'oxford_link',
						order : 5
					}
				});
		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu )
		{
			editor.contextMenu.addListener( function( element, selection )
				{
					if ( !element )
						return null;

					var isAnchor = ( element.is( 'img' ) && element.getAttribute( '_cke_real_element_type' ) == 'oxford_anchor' );

					if ( !isAnchor )
					{
						if ( !( element = CKEDITOR.plugins.oxford_link.getSelectedOxfordLink( editor ) ) )
							return null;

						isAnchor = ( element.getAttribute( 'name' ) && !element.getAttribute( 'href' ) );
					}

					return isAnchor ?
							{ oxford_anchor : CKEDITOR.TRISTATE_OFF } :
							{ oxford_link : CKEDITOR.TRISTATE_OFF, unoxford_link : CKEDITOR.TRISTATE_OFF };
				});
		}
	},

	afterInit : function( editor )
	{
		// Register a filter to displaying placeholders after mode change.

		var dataProcessor = editor.dataProcessor,
			dataFilter = dataProcessor && dataProcessor.dataFilter;

		if ( dataFilter )
		{
			dataFilter.addRules(
				{
					elements :
					{
						a : function( element )
						{
							var attributes = element.attributes;
							if ( attributes.name && !attributes.href )
								return editor.createFakeParserElement( element, 'cke_oxford_anchor', 'oxford_anchor' );
						}
					}
				});
		}
	},

	requires : [ 'fakeobjects' ]
} );

CKEDITOR.plugins.oxford_link =
{
	/**
	 *  Get the surrounding oxford_link element of current selection.
	 * @param editor
	 * @example CKEDITOR.plugins.oxford_link.getSelectedOxfordLink( editor );
	 * @since 3.2.1
	 * The following selection will all return the oxford_link element.
	 *	 <pre>
	 *  <a href="#">li^nk</a>
	 *  <a href="#">[oxford_link]</a>
	 *  text[<a href="#">oxford_link]</a>
	 *  <a href="#">li[nk</a>]
	 *  [<b><a href="#">li]nk</a></b>]
	 *  [<a href="#"><b>li]nk</b></a>
	 * </pre>
	 */
	getSelectedOxfordLink : function( editor )
	{
		var range;
		try { range  = editor.getSelection().getRanges()[ 0 ]; }
		catch( e ) { return null; }

		range.shrink( CKEDITOR.SHRINK_TEXT );
		var root = range.getCommonAncestor();
		return root.getAscendant( 'span', true );
	}
};

CKEDITOR.unoxford_linkCommand = function(){};
CKEDITOR.unoxford_linkCommand.prototype =
{
	/** @ignore */
	exec : function( editor )
	{
		/*
		 * execCommand( 'unoxford_link', ... ) in Firefox leaves behind <span> tags at where
		 * the <a> was, so again we have to remove the oxford_link ourselves. (See #430)
		 *
		 * TODO: Use the style system when it's complete. Let's use execCommand()
		 * as a stopgap solution for now.
		 */
		var selection = editor.getSelection(),
			bookmarks = selection.createBookmarks(),
			ranges = selection.getRanges(),
			rangeRoot,
			element;

		for ( var i = 0 ; i < ranges.length ; i++ )
		{
			rangeRoot = ranges[i].getCommonAncestor( true );
			element = rangeRoot.getAscendant( 'span', true );
			if ( !element )
				continue;
			ranges[i].selectNodeContents( element );
		}

		selection.selectRanges( ranges );
		editor.document.$.execCommand( 'unoxford_link', false, null );
		selection.selectBookmarks( bookmarks );
	},

	startDisabled : true
};

CKEDITOR.tools.extend( CKEDITOR.config,
{
	oxford_linkShowAdvancedTab : true,
	oxford_linkShowTargetTab : true
} );
