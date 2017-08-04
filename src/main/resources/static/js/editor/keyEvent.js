var keyEventModule = (function () {
	
	var onKeyDown = function(event) {
		if(!$iskeyPressed && (event.keyCode<37 || event.keyCode>40)) { //처음 keyDown이벤트 발생시 : 커서 위치 저장
			$iskeyPressed = true;
			$keydownPosition =  cursorModule.getCursorPosition();
			console.log("키다운 포지션" + $keydownPosition);
		}
	};
	
	var onKeyUp = function(event) {
		if($iskeyPressed){
			$iskeyPressed = false;
			console.log("키업 포지션" + cursorModule.getCursorPosition());
			//console.log(event.keyCode);
			editTextModule.setCurrentState(event); //현재 커서 위치, textarea value 저장
			if(event.keyCode==8)
				var editModel = editTextModule.setBackspaceEditModel();
			else
				var editModel = editTextModule.setCharEditModel(event);
			if(editModel.text || event.keyCode==8)
				sendSocket2(editModel); //변경 내용 계산 후 socket message전송
		}
	};
	
	var onEnterKey = function(event) {
		if($iskeyPressed){
			console.log("teset");
			sendSocket2(editTextModule.setCharModelBeforeEnter($keydownPosition));
		}
		$keydownPosition =  cursorModule.getCursorPosition();
		console.log("엔터키 포지션" + cursorModule.getCursorPosition());
		editTextModule.setEnterEditModel(event);
		sendSocket2(editTextModule.setEnterEditModel());
		var selection = $editor.getSelection();
		console.dir(selection.root.$.childNodes);
	}
	
	var onBackspaceKey = function(event) {
		var position = cursorModule.getCursorPosition();
		//console.log(cursorModule.getSelectionInfo());
		if(position==0) {
			if($iskeyPressed==true){
				$iskeyPressed = false;
				editTextModule.setCurrentState(event);
				var editModel = editTextModule.setBackspaceEditModel();
				if(editModel.line!=0)
					sendSocket2(editModel);
			} 
			$keydownPosition = 0;
			console.log("백스페이스키 포지션" + $keydownPosition);
			var editModel = editTextModule.setBackspaceEditModel();
			
			if(editModel.line!=0)
				sendSocket2(editModel);
		}
//		var selection = $editor.getSelection();
//		var range = selection.getRanges()[0];
//		console.dir(range);
	}
	
	var test = function() {
		var selection = $editor.getSelection();
		console.dir(selection.root.$.childNodes); //전체P태그 노드
		var range = selection.getRanges()[0];
		console.dir(range);
		var text = range.startContainer.$.data;
		var pCon = range.startContainer.getAscendant({p:2},true);
		console.dir(pCon.getIndex());//라인 얻기
	};
	
	return {
		onKeyDown : onKeyDown,
		onKeyUp : onKeyUp,
		onEnterKey : onEnterKey,
		onBackspaceKey : onBackspaceKey
	};
})();