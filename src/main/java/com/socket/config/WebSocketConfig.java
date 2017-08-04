package com.socket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

	//������ ���� ����
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
    	//server-side���� client-side�� ������ �� ����ϴ� ����� prefix
        config.enableSimpleBroker("/topic");
        //Server�� controller���� ����� ������ prefix
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
    	// Client�� ���� �� Server�� URL
    	// Request URL:http://127.0.0.1:8080/intern-editing-websocket/info?t=1488257937687
        registry.addEndpoint("/intern-editing-websocket").withSockJS();
    }

}