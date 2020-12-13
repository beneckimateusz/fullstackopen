import axios from "axios";
const baseUrl = "/api/persons";

const getAll = async () => {
  const { data: allPersons } = await axios.get(baseUrl);
  return allPersons;
};

const create = async (newObject) => {
  try {
    const { data: returnedObject } = await axios.post(baseUrl, newObject);
    return returnedObject;
  } catch (err) {
    console.error(err.response.data.error);
    return null;
  }
};

const update = async (changedObject) => {
  try {
    const { data: updatedObject } = await axios.put(
      `${baseUrl}/${changedObject.id}`,
      changedObject
    );
    return updatedObject;
  } catch (err) {
    console.error(err.response.data.error);
    return null;
  }
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, update, remove };
