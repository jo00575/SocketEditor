var stompClient = null;
var id = '';
var cursorPos = 0;
var startPosition = 0;
var currentText = '';
var currentTextLineArray;
var isWriting = false;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    $("#name").prop("disabled", connected);
    
    if(connected)
    	$("#edit_div").show();
    else {
    	$("#name").val("");
    	$("#edit_div").hide();
    }
}

function connect() {
    var socket = new SockJS('/intern-editing-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/subscribe/editingText/'+id, function (editedText) {
        	updateText(JSON.parse(editedText.body));
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendSocket(line, positionInLine, changedText, keyCode, keyCount) {
	stompClient.send("/app/editText/"+id, {}, JSON.stringify({
    	'writer': $("#name").val(),
    	'line': line,
    	'positionInLine': positionInLine,
    	'text': changedText,
    	'keyCode': keyCode,
    	'keyCount': keyCount
    	}));
}

function editTitle() {
	stompClient.send("/app/editTitle/"+id, {}, JSON.stringify({
    	'writer': $("#name").val(),
    	'title': $("#title").val()
    	}));
}

function updateTitle(message) {
	if( $("#name").val() != message.writer) {
		cursorPos = $("#title").getCursorPosition();
		$("#title").val(message.title);
		$("#title").setCursorPosition(cursorPos);
	}
}

function editText(data) {
	if(isWriting){
		isWriting = false;
		if( data.keyCode==13 ){ //엔터 입력
			var line = getCurrentLine();
			var positionInLine = getPositionInLine(line, startPosition);
			var keyCount = cursorPos-startPosition;
			sendSocket(line, startPosition, '', data.keyCode, keyCount);
		
		} else if( data.keyCode==8 ){ //백스페이스
			var line = getCurrentLine();
			var keyCount = startPosition-cursorPos;
			sendSocket(line, cursorPos, '', data.keyCode, keyCount);
		
		} else if( data.key.length==1 ){ //글자입력
			var line = getCurrentLine();
			var positionInLine = getPositionInLine(line, startPosition);
			var keyCount = cursorPos-startPosition;
			var textInLine = currentTextLineArray[line-1].substring(positionInLine-1, positionInLine+keyCount-1);

			sendSocket(line, positionInLine, textInLine, data.keyCode, keyCount);
		}
	}
}

function updateText(message) {
	if( $("#name").val() != message.writer && message.keyCount>0) {
		if(isChangedBeforeCursor(message)){
			if(message.keyCode == 8) {
				cursorPos -= message.keyCount;
				startPosition -= message.keyCount;
			} else {
				cursorPos += message.keyCount;
				startPosition += message.keyCount;
			}
		}
		
		$("#textArea").val(setText(message.line, message.positionInLine, message.text, message.keyCode, message.keyCount));
		$("#textArea").setCursorPosition(cursorPos);
	}
	currentText = $("#textArea").val();
}

function setText(line, positionInLine, text, keyCode, keyCount) {
	currentTextLineArray = currentText.split('\n');
	
	if(keyCode == 13) { //엔터입력일때
		var currentTextArray = currentText.split("");
		for(i=0; i<keyCount; i++)
			currentTextArray.splice(positionInLine+i,0,"\n");
		return arrayToString('', currentTextArray)
		
	} else if(keyCode == 8){ //백스페이스일때
		var currentTextArray = currentText.split("");
		currentTextArray.splice(positionInLine, keyCount);
		return arrayToString('', currentTextArray)
	} else { //문자 추가 입력
		var textInLine = currentTextLineArray[line-1].split("");
		textInLine.splice(positionInLine-1,0,text);
		currentTextLineArray[line-1] = arrayToString('', textInLine);
		return arrayToString('\n', currentTextLineArray);
	}
}

function getCurrentLine() {
	currentText = $("#textArea").val();
	cursorPos = $("#textArea").getCursorPosition();
	var line = currentText.substring(0, cursorPos).split('\n').length;
	
	return line;
}

function getPositionInLine(line, position) {
	currentTextLineArray = currentText.split('\n');
	var positionInLine = position+1;
	
	for(i=0; i<currentTextLineArray.length; i++) {
		if(i == (line-1))
			return positionInLine;
		positionInLine -= (currentTextLineArray[i].length + 1);
	}
	
}

function arrayToString(glueChar, array) {
	var resultString = '';
	for(i=0; i<array.length; i++){
		resultString += array[i];
		if(i != array.length-1)
			resultString += glueChar;
	}
	return resultString;
}

function setStartPosition() {
	if(!isWriting) {
		isWriting = true;
		startPosition =  $("#textArea").getCursorPosition();
	}
}

function isChangedBeforeCursor(message) {
	var line = getCurrentLine();
	var positionInLine = getPositionInLine(line, cursorPos);
	if(line > message.line)
		return true;
	
	if(line == message.line)
		if(positionInLine>=message.positionInLine)
			return true;
		else if(message.keyCode==13 || message.keyCode==8)
			return true;

	return false;
}

function saveContents() {
	var form = {
			'id': id,
			'latest_writer': $("#name").val(),
			'title': $('#title').val(),
			'text': $("#textArea").val()
	};
	
	$.ajax({
		url: "/editing/save",
		method: "post",
		type: "json",
		contentType: "application/json",
		data: JSON.stringify(form),
		success: function(data){
			alert("저장되었습니다.");
			$(location).attr('href', "/editList");
		},
		error: function(result){
      	   console.log(result);
     	   console.dir(result);
        }
	})
}

function deleteContents() {
	$.ajax({
		url: "/editing/delete/" + id,
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
	id = $('#id').val();
	currentText = $("#textArea").val();

    $("form").on('submit', function (e) { e.preventDefault(); });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });

    $( "#textArea" ).keydown(function(data) { setStartPosition(); });
    $( "#textArea" ).keyup(function(data) { editText(data); });
    $( "#title" ).keyup(function() { editTitle(); });
    
    $( "#save" ).click(function() { saveContents(); });
    $( "#delete" ).click(function() { deleteContents(); });
    $( "#list" ).click(function() { disconnect(); });
});