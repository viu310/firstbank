import React, { useState } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import "./chatbot.css"
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import BankApiService from "../../../BankApiService";

export default function Chatbot({ customerId, resetId }) {
    const API_KEY = 'sk-proj-xxxxxxxx';


    //처음 시스템설정
    const systemMessage = {
        "role": "system",
        "content": "당신은 친절한 인공지능 챗봇입니다. 입력에 대해 짧고 간결하고 친절하게 대답해주세요."
    };

    const [messages, setMessages] = useState([
        {
            message: customerId ? `${customerId}님, 안녕하세요. 무슨 도움이 필요하신가요?` : "안녕하세요. 무슨 도움이 필요하신가요?",
            sentTime: "just now",
            sender: "bank"
        }
    ]);

    const [isTyping, setIsTyping] = useState(false);
    //챗봇오픈여부
    const [isOpen, setIsOpen] = useState(true);

    const closeChat = () => {
        setIsOpen(false);
        resetId();
    };

    const sendBank = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
        };

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const botResponse = await getBotResponse(message);
            setMessages([...newMessages, { message: botResponse, sender: "bank" }]);
        } catch (error) {
            console.error('Error sending message to chatbot:', error);
            setMessages([...newMessages, { message: '죄송합니다. 다시 질문해주시겠어요?', sender: "bank" }]);
        }

        setIsTyping(false);
    };

    const getBotResponse = async (userMessage) => {
        switch (userMessage.toLowerCase()) {
            case '안녕':
                return '안녕하세요!';
            case '계좌개설':
                return '퍼스트뱅크 금융상품 메뉴에서 개설 가능합니다.\n<a href="/product/inout">계좌개설 바로가기</a>';
            case '출금':
            case '출금 어디서해':
            case '출금 어디':
            case '출금어디서':
            case '출금하려고해':
            case '출금은어디서하나요':
                return '퍼스트뱅크 온라인ATM에서 입출금이 가능합니다.\n<a href="/bank/atm">입출금 ATM 바로가기</a>';
            default:
                if (userMessage.toLowerCase().includes("적금")) {
                    return '퍼스트뱅크는 우대적금이 많습니다. \n<a href="product/savingDetail/5">오늘의 적금추천!</a>';
                }
                if (userMessage.toLowerCase().includes("입금")) {
                    return '퍼스트뱅크 온라인ATM에서 입출금이 가능합니다.\n<a href="/bank/atm">입출금 ATM 바로가기</a>';
                }
                if (userMessage.toLowerCase().includes("실시간환율")) {
                    return '실시간환율이 궁금하세요? \n<a href="/exchange/realtime">실시간환율 바로가기</a>';
                }
                if (userMessage.toLowerCase().includes("환율 확인")) {
                    return '실시간환율이 궁금하세요? \n<a href="/exchange/realtime">실시간환율 바로가기</a>';
                }
                if (userMessage.toLowerCase().includes("입출금")) {
                    return '퍼스트뱅크 온라인ATM에서 입출금이 가능합니다.\n<a href="/bank/atm">입출금 ATM 바로가기</a>';
                }
                if (userMessage.toLowerCase().includes("전체계좌")) {
                    return '전체계좌가 궁금하시다고요? 계좌조회에서 이용가능합니다. \n<a href="/bank/list">전체계좌조회 바로가기</a>';
                }
                if (userMessage.toLowerCase().includes("계좌")) {
                    return '퍼스트뱅크 금융상품 메뉴에서 개설 가능합니다.\n<a href="/product/inout">계좌개설 바로가기</a>';
                }
                if (userMessage.toLowerCase().includes("대출")) {
                    return '대출상품이 궁금하신가요?\n<a href="/loan/main">최고이율 대출 바로가기</a>';
                }
                if (userMessage.toLowerCase().includes("퍼스트뱅크")) {
                    return '퍼스트뱅크는 5인규모 스타트 은행으로 은행장 김주원님이 이끌고 있어요';
                }
                if (userMessage.toLowerCase().includes("퍼스트은행")) {
                    return '퍼스트은행은 ICT인재개발원의 은행 중 하나로, 다양한 금융 서비스를 제공하고 있습니다. 금융 분야에 관한 궁금한 점이 있으시면 언제든지 물어보세요!';
                }

                if (userMessage.toLowerCase().includes("어떻게")) {
                    return '퍼스트뱅크 가입은 어떠세요? \n<a href="/login">가입하러가기!</a>';
                }
                else {
                    const requestBody = {
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "system", content: "당신은 친절한 퍼스트은행 퍼스트봇입니다. 입력에 대해 은행관련으로 짧고 간결하고 친절하게 대답해주세요." }, { role: "user", content: userMessage }]
                    };

                    const response = await fetch("https://api.openai.com/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + API_KEY,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestBody)
                    });

                    const responseData = await response.json();
                    return responseData.choices[0].message.content;
                }
        }
    };
    //챗봇닫을시 null렌더링
    if (!isOpen) {
        return null;
    }

    return (
        <div className="bot_container">
            <MainContainer>
                <button className="bot_close" onClick={closeChat}>X</button>
                <ChatContainer>
                    <MessageList
                        scrollBehavior="smooth"
                        typingIndicator={isTyping ? <TypingIndicator content="bank is typing" /> : null}
                    >
                        {messages.map((message, i) => (
                            <Message
                                key={i}
                                model={message}
                                isMine={message.sender === 'user'}
                                style={{
                                    clear: 'both',
                                    float: message.sender === 'bank' ? 'left' : 'right',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    textAlign: message.sender === 'bank' ? 'left' : 'right'
                                }}
                            >
                                {/* 이미지를 포함한 답변을 HTML로 렌더링 */}
                                {message.message.startsWith('<img') ? (
                                    <div dangerouslySetInnerHTML={{ __html: message.message }} />
                                ) : (
                                    // 텍스트 답변
                                    <span>{message.message}</span>
                                )}

                            </Message>



                        ))}
                    </MessageList>
                    <MessageInput placeholder="퍼스트봇에게 물어보세요" onSend={sendBank} />
                </ChatContainer>
            </MainContainer>

        </div>
    );
}