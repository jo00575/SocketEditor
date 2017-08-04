var editTextModule = (function () {
	
	var textareaLineArray;
	var keyupPosition;
	var isHangul = 0;
	
	//editor.js 호출함수: 현재 커서 위치, textarea value 저장
	var setCurrentState = function(data) {
		textareaLineArray = $("#textArea").val().split('\n');
		keyupPosition = $("#textArea").getCursorPosition();

		if(data.keyCode!=13 && data.keyCode!=8)
			checkKeyLanguage(data.keyCode); //글자 입력일 경우 한글인지 확인(커서 이동)
	};
	
	//한글일 경우 커서이동
	var checkKeyLanguage = function(keyCode) {
		if($keydownPosition == keyupPosition) {//한글: 글자의 첫 문자 입력
			isHangul = 1;
			$("#textArea").setCursorPosition(++keyupPosition);
		} else if(($keydownPosition>keyupPosition) && (keyCode!=37) && (keyCode!=38)) {//한글: 두번째 이상 문자 입력 , keyCode 37: ArrowLeft
			isHangul = 2;
			$keydownPosition--;
			$("#textArea").setCursorPosition(++keyupPosition);
		} else if(keyCode==16 && isHangul){ //쌍자음 입력의 경우
			isHangul = 2;
		} else {//한글 외 다른문자 입력
			isHangul = 0;
		}
	}
	
	//editor.js 호출함수:변경 내용 Model 작성
	var setEditModel = function(keyData) {
		var editModel = new Object();
		
		if(keyData.keyCode == 13) //엔터 입력일 경우
			editModel = setEnterEditModel();
		else if(keyData.keyCode == 8) //백스페이스 입력
			editModel = setBackspaceEditModel();
		else if(keyData.key.length==1 || keyData.keyCode==16){ //글자 입력
			editModel = setCharEditModel();
		}

		return editModel;
	};
	
	var setEnterEditModel = function() { //Enter
		var enterEditModel = new Object();
		enterEditModel.writer = $("#name").val();
		enterEditModel.text = "";
		enterEditModel.line =  $("#textArea").getCurrentLine();
		enterEditModel.cursorPosition = $keydownPosition;
		enterEditModel.keyCode = 13;
		enterEditModel.keyCount = keyupPosition-$keydownPosition;

		return enterEditModel;
	};
	
	var setBackspaceEditModel = function() { //Backspace
		var backspaceEditModel = new Object();
		backspaceEditModel.writer = $("#name").val();
		backspaceEditModel.text = "";
		backspaceEditModel.line = $("#textArea").getCurrentLine();
		backspaceEditModel.cursorPosition = keyupPosition;
		backspaceEditModel.keyCode = 8;
		backspaceEditModel.keyCount = keyupPosition-$keydownPosition;
		
		return backspaceEditModel;
	}
	
	var setCharEditModel = function() { //Character
		var charEditModel = new Object();

		var changedLine = $("#textArea").getCurrentLine();
		var positionInLine = $("#textArea").getPositionInLine($keydownPosition);
		var keyCount = keyupPosition-$keydownPosition;

		charEditModel.writer = $("#name").val();
		charEditModel.text = getChangedText(changedLine, positionInLine, keyCount);
		charEditModel.line = changedLine;
		charEditModel.cursorPosition = positionInLine;
		charEditModel.keyCode = 0;
		charEditModel.keyCount = keyCount;
		charEditModel.isHangul = isHangul;
		charEditModel.lineText = textareaLineArray[changedLine-1];
		
		return charEditModel;
	}

	//변경된 내용 반환
	var getChangedText = function(line, positionInLine, keyCount) {
		var textInLine = textareaLineArray[line-1];
		var changedText = '';
		
		if(isHangul) //한글일 경우: 앞글자 포함 반환
			changedText = textInLine.substring(positionInLine-2, positionInLine+keyCount-1);
		else {
			changedText = textInLine.substring(positionInLine-1, positionInLine+keyCount-1);
			if(changedText.charAt(changedText.length-1) == ' '){ //띄어쓰기 포함일 때
				isHangul = 1;
				changedText = textInLine.substring(positionInLine-2, positionInLine+keyCount-1);
			}
		}
		return changedText;
	};
	
	return {
		setCurrentState : setCurrentState,
		setEditModel : setEditModel
	};
	
})();