var updateTextModule = (function () {
	
	var textareaCharArray;
	var textareaLineArray;
	var currentPosition;
	
	//editor.js 호출함수: 현재 커서 위치, textarea value 저장
	var setCurrentState = function() {
		var textarea = $("#textArea").val();
		textareaLineArray = textarea.split('\n');
		textareaCharArray = textarea.split('');
		currentPosition = $("#textArea").getCursorPosition();
	};
	
	//editor.js 호출함수: 현재 커서 위치 재설정
	var modifyCursorPosition = function(message) {
		
		if(isChangedBeforeCursor(message)){
			currentPosition += message.keyCount;
			$keydownPosition += message.keyCount;
		}
		
		return currentPosition;
	};
	
	//editor.js 호출함수: 내용 업데이트
	var setText = function(message) {
		var resultText = '';
		
		if(message.keyCode == 13)
			resultText = setTextByEnter(message);
		else if(message.keyCode == 8)
			resultText = setTextByBackspace(message);
		else
			resultText = setTextByCharKey(message);
		
		console.log(resultText);
		return resultText;
	};
	
	//변경될 위치 확인 (현재 커서 위치 기준)
	var isChangedBeforeCursor = function(message) {
		var line = $("#textArea").getCurrentLine();
		var positionInLine = $("#textArea").getPositionInLine(currentPosition);
		
		if(line > message.line)
			return true;
		
		if(line == message.line)
			if(positionInLine>message.cursorPosition)
				return true;
			else if(message.keyCode==13 || message.keyCode==8)
				return true;

		return false;
	};
	
	var setTextByEnter = function(message) {
		//엔터 입력 수 만큼 \n문자 추가
		for(i=0; i<message.keyCount; i++)
			textareaCharArray.splice(message.cursorPosition+i,0,"\n");
		return textareaCharArray.join('');
	};
	
	var setTextByBackspace = function(message) {
		//backspace 입력 수 만큼 문자열 삭제
		textareaCharArray.splice(message.cursorPosition, Math.abs(message.keyCount));
		return textareaCharArray.join('');
	};
	
	var setTextByCharKey = function(message) {		
		var textInLine = textareaLineArray[message.line-1].split("");
		if(message.isHangul)//한글 업데이트
			textInLine = setHangulText(message);
		else //한글 외 문자
			textInLine.splice(message.cursorPosition-1,0,message.text);

		textareaLineArray[message.line-1] = textInLine.join('');
		return textareaLineArray.join('\n');
	};
	
	//한글 업데이트
	var setHangulText = function(message) {
		var textInLine = textareaLineArray[message.line-1].split("");
		
		if(message.cursorPosition==1) //라인의 첫글자일때 (한글자만 업데이트)
			textInLine[message.cursorPosition-1] = message.text;
		else if(message.isHangul==2){ //두번째 이상 문자 입력
			textInLine[message.cursorPosition-2] = message.text;
			textInLine[message.cursorPosition-1] = '';
		} else { //isHangul==1: 글자의 첫 문자 입력
			textInLine[message.cursorPosition-2] = message.text.split("")[0];
			textInLine.splice(message.cursorPosition-1,0,message.text.split("")[1]);
		}
		
		return textInLine;
	}
	
	return {
		setCurrentState : setCurrentState,
		modifyCursorPosition : modifyCursorPosition,
		setText : setText
	};
	
})();