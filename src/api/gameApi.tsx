import axios from "axios";

const getMatches = async () => {
    const { data } = await axios.get("https://run.mocky.io/v3/395c03b3-f736-44eb-ae3d-4b8fd1d7257b");
    const {games} = data;
    let id = 1;
     for (const g of games){
         g.id = id;
         id += 1;
     }
    return games;
}

export default {
    getMatches,
}