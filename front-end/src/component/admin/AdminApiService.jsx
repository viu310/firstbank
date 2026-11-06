import axios from 'axios'; 

const ADMIN_URL = "http://localhost:8081/admin";

const token = sessionStorage.getItem("token");

function adminLogout(){
    console.log('로그아웃');
    console.log(ADMIN_URL+'/logout/'+token);
    console.log(token);
    return axios.get(ADMIN_URL+'/logout/'+token,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}
function getId(num){
    return axios.get(`${ADMIN_URL}/${num}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}



const AdminApiService = {
    adminLogout,
    getId
};

export default AdminApiService;