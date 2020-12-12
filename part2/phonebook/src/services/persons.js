import axios from "axios";
const baseUrl = "/api/persons";

const getAll = async () => {
  const { data: allPersons } = await axios.get(baseUrl);
  return allPersons;
};

const create = async (newObject) => {
  const { data: returnedObject } = await axios.post(baseUrl, newObject);
  return returnedObject;
};

const update = async (changedObject) => {
  const { data: updatedObject } = await axios.put(
    `${baseUrl}/${changedObject.id}`,
    changedObject
  );
  return updatedObject;
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, update, remove };
