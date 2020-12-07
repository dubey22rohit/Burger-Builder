import axios from 'axios';

const instance = axios.create({
    baseURL : "https://burgerbuilder-679e6-default-rtdb.firebaseio.com/"
})
export default instance;