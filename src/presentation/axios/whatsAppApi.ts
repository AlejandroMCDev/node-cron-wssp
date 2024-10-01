import axios from 'axios';


const whatsappApi = axios.create({
  baseURL: 'https://apixwhatsapp.azurewebsites.net/v1',
});

export { whatsappApi };