var editTextModule = (function () {
	
	var selection;
	var range;
	var editorLineArray;
	var keyupPosition;
	
	//editor.js 호출함수: 현재 커서 위치, textarea value 저장
	var setCurrentState = function(data) {
		console.log("setCurrentState");
		selection = $editor.getSelection();
		range = selection.getRanges()[0];
		editorLineArray = selection.root.$.childNodes;
		keyupPosition = cursorModule.getCursorPosition();
	};
	
	var setEnterEditModel = function() { //Enter
		console.log("setEnterEditModel");
		selection = $editor.getSelection();
		range = selection.getRanges()[0];
		var enterEditModel = new Object();
		enterEditModel.writer = $("#name").val();
		enterEditModel.title = $( "#titleInput" ).val();
		enterEditModel.text = range.startContainer.$.data;
		enterEditModel.line =  cursorModule.getCurrentLine();
		enterEditModel.cursorPosition = $keydownPosition;
		enterEditModel.keyCode = 13;
		enterEditModel.keyCount = keyupPosition-$keydownPosition;
		enterEditModel.lineText = range.startContainer.$.data;
		enterEditModel.sequence = $revision;

		return enterEditModel;
	};
	
	var setBackspaceEditModel = function() { //Backspace
		console.log("setBackspaceEditModel");
		selection = $editor.getSelection();
		range = selection.getRanges()[0];
		var backspaceEditModel = new Object();
		backspaceEditModel.writer = $("#name").val();
		backspaceEditModel.title = $( "#titleInput" ).val();
		backspaceEditModel.line = cursorModule.getCurrentLine();
		backspaceEditModel.keyCode = 8;
		if($keydownPosition==0){
			backspaceEditModel.text = "";
			backspaceEditModel.cursorPosition = $keydownPosition;
			backspaceEditModel.keyCount = -1;
		}
		else {
			backspaceEditModel.text = "keyup";
			backspaceEditModel.cursorPosition = keyupPosition;
			backspaceEditModel.keyCount = keyupPosition-$keydownPosition;
		}
		backspaceEditModel.lineText = range.startContainer.$.data;
		backspaceEditModel.sequence = $revision;
		
		return backspaceEditModel;
	}
	
	var setCharEditModel = function(keyData) { //Character
		console.log("setCharEditModel");
		var charEditModel = new Object();
		if($keydownPosition<keyupPosition){
			var changedLine = cursorModule.getCurrentLine();
			var keyCount = keyupPosition-$keydownPosition;
			charEditModel.writer = $("#name").val();
			charEditModel.title = $( "#titleInput" ).val();
			charEditModel.text = getChangedText($keydownPosition, keyCount);
			charEditModel.line = changedLine;
			charEditModel.cursorPosition = $keydownPosition;
			charEditModel.keyCode = 0;
			charEditModel.keyCount = keyCount;
			charEditModel.lineText = range.startContainer.$.data;
			charEditModel.sequence = $revision;
		}
		
		return charEditModel;
	}
	
	var setCharModelBeforeEnter = function(position) {
		var charEditModel = new Object();
		var changedLine = cursorModule.getCurrentLine();
		charEditModel.writer = $("#name").val();
		charEditModel.title = $( "#titleInput" ).val();
		charEditModel.text = getChangedText(position, 1);
		charEditModel.line = changedLine;
		charEditModel.cursorPosition = position;
		charEditModel.keyCode = 0;
		charEditModel.keyCount = 1;
		charEditModel.lineText = range.startContainer.$.data;
		charEditModel.sequence = $revision;
		
		return charEditModel;
	}
	
	//변경된 내용 반환
	var getChangedText = function(positionInLine, keyCount) {
		console.log("getChangedText");
		var textInLine = range.startContainer.$.data;
		var changedText = '';

		changedText = textInLine.substring(positionInLine, positionInLine+keyCount);
		if(changedText.charAt(changedText.length-1) == ' '){ //띄어쓰기 포함일 때
			changedText = textInLine.substring(positionInLine, positionInLine+keyCount+1);
		}

		return changedText;
	};
	
	var getTextBeforeChanged = function(positionInLine, keyCount) {
		var textInLine = range.startContainer.$.data.split("");
		textInLine.splice(positionInLine,keyCount);
		
		return textInLine.join('');
	}
	
	return {
		setCurrentState : setCurrentState,
		setCharEditModel : setCharEditModel,
		setEnterEditModel : setEnterEditModel,
		setBackspaceEditModel : setBackspaceEditModel,
		setCharModelBeforeEnter : setCharModelBeforeEnter
	};
	
})();