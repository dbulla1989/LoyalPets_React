import apiService from "../resources/GlobalResource";

const petService = {
  getPets: async () => {
    const user = JSON.parse(localStorage.getItem("User"));

    const res = await apiService.get(`api/pet/all/${user.personId}`);
    console.log(res);
    return res;
  },

  getPetByPerson: async () => {
    const user = JSON.parse(localStorage.getItem("User"));
    const res = apiService.get(`api/pet/${user.personId}`);
    return res;
  },
};

export default petService;
