var updateTextModule = (function () {
	
	var selection;
	var element;
	var range;
	var node;
	var parents;
	
	//editor.js 호출함수: 현재 커서 위치, textarea value 저장
	var setCurrentState = function(message) {
		//console.log("setCurrentState");
		$editor.focus();
		selection = $editor.getSelection();
		element = selection.getStartElement();
		range = selection.getRanges()[0];
		node = range.startContainer;
		parents = node.getParents(true);
		
		node = parents[parents.length - 2].getFirst();
		for(i=0; i<message.line; i++){
			node = node.getNext();
		}
	};
	
	//editor.js 호출함수: 현재 커서 위치 재설정
	var modifyCursorPosition = function(message) {
		//console.log("modifyCursorPosition");
		var position = cursorModule.getCursorPosition();
		if(isChangedBeforeCursor(message, position)){
			$keydownPosition += message.keyCount;
			position += message.keyCount;
		}

		return position;
	};
	
	var isChangedBeforeCursor = function(message, position) {
		//console.log("isChangedBeforeCursor");
		var line = cursorModule.getCurrentLine();
		//console.log("line: " + line);
		//console.log("position" + position);
		if(line == message.line){
			if(position > message.cursorPosition+1){
				return true;
			}
			else if(position-message.cursorPosition<2 && message.keyCode==8){
				return true
			}
		}
			

		return false;
	};
	
	//editor.js 호출함수: 내용 업데이트
	var setText = function(message) {
		//console.log("setText");
		if($iskeyPressed && !isChangedBeforeCursor(message, $keydownPosition))
			message.cursorPosition++;
		
		if(message.keyCode == 13)
			setTextByEnter(message);
		else if(message.keyCode == 8)
			setTextByBackspace(message);
		else
			setTextByCharKey(message);
	};
	
	
	var setTextByEnter = function(message) {
		//console.log("setTextByEnter");
		var textInLine = node.$.textContent;
		var text = textInLine.substring(message.cursorPosition, textInLine.length);
		node.setText(textInLine.substring(0, message.cursorPosition));
		
		range.setStart(node.getFirst(), message.cursorPosition);
		range.setEnd(node.getFirst(), message.cursorPosition);
		range.select();
		$editor.insertHtml("<p>&nbsp;</p>");
		if(text.length>0){
			$editor.focus();
			selection = $editor.getSelection();
			element = selection.getStartElement();
			range = selection.getRanges()[0];
			node = range.startContainer;
			parents = node.getParents(true);
			
			node = parents[parents.length - 2].getFirst();
			for(i=0; i<message.line+1; i++){
				node = node.getNext();
			}
			node.setText(text);
		}
		console.log(text);
	};
	
	var setTextByBackspace = function(message) {
		//console.log("setTextByBackspace");
		var textInLine = node.$.textContent.split("");
		//console.log(textInLine);
		if((textInLine.length==Math.abs(message.keyCount))&&message.text!=""){
			node.setHtml('&nbsp;');
		}
		else if(message.cursorPosition == 0){
			node.remove(false);
			if(textInLine.length!=0){
				$editor.focus();
				selection = $editor.getSelection();
				element = selection.getStartElement();
				range = selection.getRanges()[0];
				node = range.startContainer;
				parents = node.getParents(true);
				
				node = parents[parents.length - 2].getFirst();
				for(i=0; i<message.line-1; i++){
					node = node.getNext();
				}
				console.log(node);
				node.$.textContent += textInLine.join('');
				node.setText(node.$.textContent);
			}
		} else {
			textInLine.splice(message.cursorPosition,Math.abs(message.keyCount));
			node.setText(textInLine.join(''));
		}
		console.log(node.$.textContent);
	};
	
	var setTextByCharKey = function(message) {		
		//console.log("setTextByCharKey");
		var textInLine = node.$.textContent.split("");

		textInLine.splice(message.cursorPosition,0,message.text);
		node.setText(textInLine.join(''));
		console.log(textInLine.join(''));
	};
	
	return {
		setCurrentState : setCurrentState,
		modifyCursorPosition : modifyCursorPosition,
		setText : setText
	};
	
})();