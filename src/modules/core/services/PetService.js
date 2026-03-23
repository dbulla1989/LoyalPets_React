import apiService from "../resources/GlobalResource";

const petService = {
  getPets: async () => {
    const person = JSON.parse(localStorage.getItem("Person"));

    const res = await apiService.get(`api/pet/all/${person.id}`);
    console.log(res);
    return res;
  },

  getPetByPerson: async (personId) => {
    const res = apiService.get(`api/pet/${personId}`);
    return res;
  },
};

export default petService;
