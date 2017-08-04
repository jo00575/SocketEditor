package com.socket.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.socket.model.EditModel;

@Controller
public class EditorSocketController {

	private static final Logger logger = LoggerFactory.getLogger(EditorSocketController.class);
	
	private int sequence = 0;;
	
	@MessageMapping("/test")
	@SendToUser("/topic/test")
	public int test() throws Exception {
		System.out.println("!!!!!!CHECK!!!!!!!");
		if(sequence == 0)
			sequence++;
		return sequence;
	}
	
	@MessageMapping("/editText/{id}") //��û URL
	@SendTo("/topic/editingText/{id}") //������ ���� URL
	public EditModel editingText(@DestinationVariable String id, EditModel message) throws Exception {
		//Thread.sleep(2000);
		message.setSequenceInServer(++sequence);
		System.out.println("!!!!!!!!"+sequence);
		logger.info("! Text socket id: {}, Writer: {}", id, message.getWriter());
		return message;
	}

}
