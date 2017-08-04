var stompClient = null;

function connect() {
    var socket = new SockJS('/intern-editing-websocket'); //클라이언트 소켓 생성
    stompClient = Stomp.over(socket); //전역변수에 세션 설정
    stompClient.connect({}, function (frame) { //소켓 연결
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/editingText/'+$id, function (editedText) {
        	updateText(JSON.parse(editedText.body));
        });
        stompClient.subscribe('/topic/editingTitle/'+$id, function (editedTitle) {
        	updateTitle(JSON.parse(editedTitle.body));
        });
        stompClient.subscribe('/user/topic/connected', function (revision) {
        	$revision = revision.body;
        });
        stompClient.send("/app/connected/"+$id, {}, JSON.stringify());
    });
//    setTimeout(function(){
//    	checkDiffModule.checkDiff();
//    }, 3000);
    
}

function disconnect() { //소켓 연결 해제
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function setConnected(connected) { //editor 화면 설정
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    $("#name").prop("disabled", connected);

	//checkDiffModule.setLatestContents();
    $editorReadConfig.setReadOnly(!connected);
    

}

function sendSocket2(editModel) { //텍스트 변경 시 변경모델 포함 소켓 전송
	if(editModel.writer)
		stompClient.send("/app/editText/"+$id, {}, JSON.stringify(editModel));
}