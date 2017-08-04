package com.socket.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditModel {

	//Text������ ���޵Ǵ� �޽����� ���
	private String writer;
	private String text;
	private int line;
	private int cursorPosition;
	private int keyCode;
	private int keyCount;
	private int isHangul;
	private int sequence;
	private int sequenceInServer;
	private String lineText;
}