import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper'


axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;



/** Custom hook */

export default function useFetch(query) {
    const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null });
  
    useEffect(() => {

  
      const fetchData = async () => {
        try {
          setData((prev) => ({ ...prev, isLoading: true }));
  
          // Ensure the correct API endpoint and handle the query appropriately
          
          const { username } = !query ? await getUsername() : '';
          
          const { data, status } = !query ? await axios.get(`http://localhost:8080/api/user/${username}`) : await axios.get(`http://localhost:8080/api/${query}`);
          

          // Update apiData for all successful status codes (not just 201)
          setData((prev) => ({ ...prev, isLoading: false, apiData: data, status }));
        } catch (error) {
          // Update serverError state with the error object
          setData((prev) => ({ ...prev, isLoading: false, serverError: error }));
        }
      };
  
      fetchData();
    }, [query]);
  
    return [getData, setData];
  }
  
  