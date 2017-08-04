var $id = '';
var $keydownPosition = 0;
var $sequence;
var editModel;
var iskeyPressed = false;
var $textarea;
var textareaLineArray;

function editTitle() {
	stompClient.send("/app/editTitle/"+$id, {}, JSON.stringify({
    	'writer': $("#name").val(),
    	'title': $("#title").val()
    	}));
}

function updateTitle(message) {
	if( $("#name").val() != message.writer) {
		$("#title").val(message.title);
	}
}

function setKeydownPosition() {
	if(!iskeyPressed) { //처음 keyDown이벤트 발생시 : 커서 위치 저장
		iskeyPressed = true;
		console.log("키다운");
//		console.log("$textarea:\n" + $textarea);
		//$textarea = $("#textArea").val();
		textareaLineArray = $("#textArea").getCurrentLine();
		//console.log("textareaLineArray:" + textareaLineArray);
		$keydownPosition =  $("#textArea").getCursorPosition();
	}
}

function editText(data) {
	if(iskeyPressed){
		iskeyPressed = false;

//		console.log("CursorPosition:" + $("#textArea").getCursorPosition());
		console.log("key: " + data.key);
		editTextModule.setCurrentState(data); //현재 커서 위치, textarea value 저장
		editModel = editTextModule.setEditModel(data);
		editModel.sequence = ++$sequence;
		sendSocket(editModel); //변경 내용 계산 후 socket message전송
	}
}

function updateText(message) {
	if( $("#name").val() != message.writer) { //본인이 수정한 메시지가 아닐 경우
		//현재 커서 위치, textarea value 저장
		updateTextModule.setCurrentState($("#textArea").val());
		//내용 변경 전, 현재 커서 위치 재설정
		var cursorPosition = updateTextModule.modifyCursorPosition(message);

		$("#textArea").val(updateTextModule.setText(message)); //내용 업데이트
		$("#textArea").setCursorPosition(cursorPosition); //커서 위치 설정

	} else { //본인이 수정한 경우 : 내용 저장
		saveContents(true);
	}
	
}

function updateTextTest2(message) {
	if(message.sequence<message.sequenceInServer) {
		
		
	}
}

function updateTextTest(message) {
	if( $("#name").val() != message.writer) { //본인이 수정한 메시지가 아닐 경우
		if(message.sequence<message.sequenceInServer) {
			if(editModel.keyCode==13 && (editModel.line+1 == message.line)){
				message.line++; console.log("엔터 후 메세지 라인 재설정");
			} else if (editModel.keyCode==0 &&(editModel.line==message.line) && (editModel.cursorPosition<message.cursorPosition)){
				message.cursorPosition += editModel.keyCount; console.log("동시 메세지 위치 재설정");
			}
		}
		updateTextModule.setCurrentState($("#textArea").val());
		var cursorPosition = updateTextModule.modifyCursorPosition(message);
		$textarea = updateTextModule.setText(message);
		$("#textArea").val($textarea);
		$("#textArea").setCursorPosition(cursorPosition);
	} else { //본인이 수정한 경우 : 내용 저장
		var test = updateTextModule22.setText($textarea, message);
		var test22 = editTextModule.getChangedText2(test, message.line, message.cursorPosition, message.keyCount);
		console.log("test: \n" + test);
		console.log("aaaa: \n" + $("#textArea").val());
		console.log("text in test: \n" + test22);
		//if(test != $("#textArea").val()){
		if((message.keyCode==13) && ($("#textArea").val()!=test)){
			console.log("엔터인데 텍스트가 다를때");
			$("#textArea").val(test);
			$("#textArea").setCursorPosition(message.cursorPosition+message.keyCount-1);
			$textarea = test;
		}
		else if((message.keyCode!=8) && (test22!=message.text)) {
			console.log("여기 확인");
			$("#textArea").val(test);
			$("#textArea").setCursorPosition(message.cursorPosition+message.keyCount);
			$textarea = test;
		} else {
			$textarea = test;
		}
	}
	editModel = message;
	$sequence = message.sequenceInServer;
}

function saveContents(isWriting) { //내용 저장 및 업데이트
	var form = {
			'id': $id,
			'latest_writer': $("#name").val(),
			'title': $('#title').val(),
			'text': $("#textArea").val()
	};
	
	$.ajax({
		url: "/editor/save",
		method: "post",
		type: "json",
		contentType: "application/json",
		data: JSON.stringify(form),
		success: function(data){
			if(isWriting){ //텍스트 수정 중 : 실시간 저장
				console.log("내용 저장 완료");
			} else { //사용자가 'Save'를 클릭했을 경우
				alert("저장되었습니다.");
				$(location).attr('href', "/editList");
			}
		},
		error: function(result){
      	   console.log(result);
     	   console.dir(result);
        }
	})
}

function deleteContents() { //내용 삭제
	$.ajax({
		url: "/editor/delete/" + $id,
		method: "post",
		success: function(data){
			alert("삭제되었습니다.");
			$(location).attr('href', "/editList");
		},
		error: function(result){
      	   console.log(result);
     	   console.dir(result);
        }
	})
}


$(function () {
	$id = $('#id').val();
	$textarea = $( "#textArea" ).val();

    $("form").on('submit', function (e) { e.preventDefault(); });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });

    $( "#textArea" ).keydown(function(data) { setKeydownPosition(); });
    $( "#textArea" ).keyup(function(data) { editText(data); });
    
    $( "#title" ).keyup(function() { editTitle(); });
    
    $( "#save" ).click(function() { saveContents(false); });
    $( "#delete" ).click(function() { deleteContents(); });
    $( "#list" ).click(function() { disconnect(); });
});