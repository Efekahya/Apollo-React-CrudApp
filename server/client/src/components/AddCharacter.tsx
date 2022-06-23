import { gql, useMutation } from "@apollo/client";
import React from "react";
export default function AddCharacter() {
  const ADD_CHARACTER = gql`
    mutation AddNewCharacter(
      $name: String!
      $location: String!
      $image: String!
    ) {
      createPerson(name: $name, location: $location, image: $image) {
        name
        id
        location {
          name
        }
        image
      }
    }
  `;

  const [add, data] = useMutation(ADD_CHARACTER);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.image.files[0]);
    formData.append("upload_preset", "u8gn8k3a");
    const data = await fetch(
      "https://api.cloudinary.com/v1_1/ds4yfccnf/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => res.json());
    console.log(data);
    add({
      variables: {
        name: e.target.name.value,
        location: e.target.location.value,
        image: data.secure_url,
      },
    });
  };
  return (
    <>
      <div className="col-5">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control mb-2"
              id="name"
              placeholder="Enter name"
            />
            <input type="hidden" className="form-control" id="id" />
            <input
              type="text"
              className="form-control mb-2"
              id="location"
              placeholder="Enter location"
            />
            <input
              type="file"
              className="form-control mb-2"
              id="image"
              accept="image/*"
            />
            <button
              type="submit"
              className="btn btn-secondary form-control w-25"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
