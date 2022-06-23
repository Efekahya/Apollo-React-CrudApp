const axios = require("axios");
const { argsToArgsConfig } = require("graphql/type/definition");

let characters = axios
  .get(
    "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/12e5c19f-cd6c-4069-a797-9720f280c57d/ricky-and-morty.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220622%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220622T225044Z&X-Amz-Expires=86400&X-Amz-Signature=d0fa6271dd5d03b6adf3dc6246b7761acd39514c8dc9976c8c03e354ea5d7b43&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22ricky-and-morty.json%22&x-id=GetObject"
  )
  .then((res) => {
    characters = res.data;
  })
  .catch((err) => {
    console.log(err);
  });

const resolvers = {
  Query: {
    characters: (_, args) =>
      characters.slice(args.limit * args.page, (args.page + 1) * args.limit),
    character: (_, args) =>
      characters.find((character) => character.id === args.id),

    ricks: (_, args) => {
      return characters
        .filter((character) => {
          if (character.name.includes("Rick")) {
            return character;
          }
        })
        .slice(args.limit * args.page, (args.page + 1) * args.limit);
    },

    mortys: (_, args) => {
      return characters
        .filter((character) => {
          if (character.name.includes("Morty")) {
            return character;
          }
        })
        .slice(args.limit * args.page, (args.page + 1) * args.limit);
    },
    upload: async (_, args) => {
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/ds4yfccnf/image/upload",
        {
          file: args.image,
          upload_preset: "u8gn8k3a",
        }
      );
      return data.secure_url;
    },
  },
  Mutation: {
    createPerson: (_, args) => {
      const newPerson = {
        id: characters.length + 1,
        name: args.name,
        location: {
          name: args.location,
          url: "/",
        },
        image: args.image,
      };
      characters.push(newPerson);
      return newPerson;
    },
    deletePerson: (_, args) => {
      const person = characters.find((character) => character.id === args.id);
      characters = characters.filter((character) => character.id !== args.id);
      return person;
    },
    updatePerson: (_, args) => {
      const person = characters.find((character) => character.id === args.id);
      person.name = args.name;
      person.location.name = args.location;
      person.image = args.image;
      return person;
    },
  },
};

module.exports = { resolvers };
