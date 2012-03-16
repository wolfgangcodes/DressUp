var fs = require("fs");
var path = require("path");

/* Prepare CSS for inclusion in a JavaScript string: escape quotes and remove
 newlines */
var prepCss = function( css, quoteStr, important ) {
	css = css.replace(new RegExp(quoteStr, "g"), "\\" + quoteStr );
	css = quoteStr + css.replace(/\r|\n/g, " ") + quoteStr;
	if ( important ) {
		css = css.replace(/;/g, " !important;");
	}
	return css;
};

var parseRules = function( contents, allRules ) {
	return contents.replace(/([^{]+){([^}]+)}/g, function( matched, selectors, declarations ) {
		allRules[ selectors.trim() ] = declarations.trim();
	});
};

var processJs = function( contents, directory, allRules ) {

	// Import rules

	contents = contents.replace(/(["'])\s*!import_rule\s+(.+)\1/g,
		function( matched, quoteStr, selectors ) {

	if ( allRules[ selectors.trim() ] ) {
	return prepCss(allRules[ selectors.trim() ], quoteStr);
	}
	  return matched;
		}
	);

	// Import files
	contents = contents.replace(/(["'])\s*!import_file\s+(.+)\1/g,
		function( matched, quoteStr, fileName ) {
			var css;
			try {
				css = fs.readFileSync( path.join( directory, fileName ), "ascii" );
				return prepCss( css, quoteStr );
			} catch( err ) {
				// Exit with an error if an unreadable file was specified
				process.exit(1);
			}
		}
	);

	return contents;
};

var fileNames = {
	css: [],
	js: []
};
var allRules = {};
var fileContents;
var idx, len;
var argument, extension;

for( idx = 2, len = process.argv.length; idx < len; ++idx ) {
	argument = process.argv[ idx ];
	extension = (/\.(js|css)$/.exec( argument ) || [])[1];
	if( fileNames[ extension ] ) {
		fileNames[ extension ].push( argument );
	}
}

for( idx = 0, len = fileNames.css.length; idx < len; ++idx ) {

	try {
		fileContents = fs.readFileSync(fileNames.css[idx], "ascii");
	} catch( err ) {}

	parseRules( fileContents, allRules );
}

for( idx = 0, len = fileNames.js.length; idx < len; ++idx ) {

	try {
		fileContents = fs.readFileSync(fileNames.js[idx], "ascii");
	} catch( err ) {}

	process.stdout.write(processJs( fileContents, path.dirname(fileNames.js[idx]), allRules) );
}
