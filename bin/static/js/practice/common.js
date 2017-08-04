jQuery.fn.extend({
	setSelection: function(selectionStart, selectionEnd) {
        if(this.length == 0) return this;
        input = this[0];

        if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        } else if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }

        return this;
    },
	getCursorPosition: function() {
          var el = $(this).get(0);
          var pos = 0;
          if('selectionStart' in el) {
        	  if((el.selectionEnd-el.selectionStart) > 1)
        		  pos = el.selectionEnd;
        	  else
        		  pos = el.selectionStart;
          } else if('selection' in document) {
              el.focus();
              var Sel = document.selection.createRange();
              var SelLength = document.selection.createRange().text.length;
              Sel.moveStart('character', -el.value.length);
              pos = Sel.text.length - SelLength;
          }
          return pos;
      },
	setCursorPosition: function(position){
		if(this.length == 0) return this;
		return $(this).setSelection(position, position);
	},
	getCurrentLine: function() {
		var textValue = $(this).val();
		var currentPosition = $(this).getCursorPosition();
		var textValueArray = textValue.substring(0, currentPosition).split('\n');
		
		return textValueArray.length;
	},
	getPositionInLine: function(position) {
		var textareaArray = $(this).val().split('\n');
		var line = $(this).getCurrentLine();
		var positionInLine = position+1;
		
		for(i=0; i<line-1; i++) 
			positionInLine -= (textareaArray[i].length + 1);
		
		return positionInLine;
	}
});