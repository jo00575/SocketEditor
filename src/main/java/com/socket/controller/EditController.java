package com.socket.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class EditController {
	@RequestMapping("/editor") 
	public String testPage() {

		return "editor";
	}
	
	@RequestMapping("/") 
	public String testPag2e() {

		return "editList";
	}

}
