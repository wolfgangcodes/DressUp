(function( window, document, $, undefined ) {

  var $style1 = $("<style>").text("header { 	font-family: \"Times New Roman\", serif; 	background-image: url('../img/somanycats.png'); }  h1 { 	font-weight: bold !important; } ");
  var $style2 = $("<style>").text('header { 	font-family: "Times New Roman", serif; 	background-image: url(\'../img/somanycats.png\'); }  h1 { 	font-weight: bold !important; } ');

})( this, this.document, this.jQuery );
