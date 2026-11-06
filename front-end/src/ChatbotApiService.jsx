import axios from 'axios';

const CHAT_URL = "http://13.124.80.180:8081/chatbot";
const token = sessionStorage.getItem("token");

// 메시지 전송
function sendMessage(message) {
    const body = { message };
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    return axios.post(CHAT_URL, body, config);
}

// 메세지 응답

export default ChatbotApiService = {
    sendMessage
};