var cursorModule = (function() {
	
	var getSelectionInfo = function() {
		var selection = {};
		$editor.focus();
		var selection = $editor.getSelection();
		var range = selection.getRanges()[0];
		
		selection.startCursor = range.startOffset;
		selection.startLine = range.startContainer.getAscendant({p:2},true).getIndex();
		
		selection.endCursor = range.endOffset;
		selection.endLine = range.endContainer.getAscendant({p:2}, true).getIndex();
		
		return selection;
	};
	
	
	var getCursorPosition = function() {
		//console.log("getCursorPosition");
		$editor.focus();
		var selection = $editor.getSelection();
		var range = selection.getRanges()[0];
		//console.dir(range);
		if(range.endOffset == range.startOffset)
			return range.startOffset;
		else
			return range.endOffset;
	};
	
	var setCursorPosition = function(position) {
		console.log("setCursorPosition");
		$editor.focus();
		var selection = $editor.getSelection();
		var element = selection.getStartElement();
		var range = selection.getRanges()[0];
		range.setStart(element.getFirst(), position);
		range.setEnd(element.getFirst(), position);
		range.select();
	};
	
	var getCurrentLine = function() {
		//console.log("getCurrentLine");
		$editor.focus();
		var selection = $editor.getSelection();
		var range = selection.getRanges()[0];
		//console.log(range);
		var pCon = range.startContainer.getAscendant({p:2},true);
		
		return pCon.getIndex();
	};
	
	var setSelection = function(position) {
		console.log("setSelection");
		var selection = $editor.getSelection();
		var element = selection.getStartElement();
		var range = selection.getRanges()[0];
		var pCon = range.startContainer.getAscendant('p',true);
		console.log(selection.getElement(0));
		
		var newRange = new CKEDITOR.dom.range(range.document);
		newRange.moveToPosition(pCon, CKEDITOR.POSITION_BEFORE_START);
		newRange.setStart(element.getFirst(), position);
		newRange.setEnd(element.getFirst(), position);
		newRange.select();
	};
	
	return {
		getSelectionInfo : getSelectionInfo,
		getCursorPosition : getCursorPosition,
		setCursorPosition : setCursorPosition,
		getCurrentLine : getCurrentLine,
		setSelection : setSelection
	};
})();