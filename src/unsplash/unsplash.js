import axios from "axios";

export default axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: 'Client-ID mwvDZIOI1A0tK8BC_w5VwxZk8l2IGyzfyo-aSXujJYY'
  }

})
