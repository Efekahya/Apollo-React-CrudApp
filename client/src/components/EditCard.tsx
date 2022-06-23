import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
export default function EditCard() {
  const [isLoading, setIsLoading] = useState(false);
  console.log(window.location.pathname.split("/")[2]);
  // get character from id in url
  const GET_CHARACTER = gql`
    query GetCharacter($id: Int!) {
      character(id: $id) {
        name
        id
        location {
          name
        }
        image
      }
    }
  `;
  const getCharacter = useQuery(GET_CHARACTER, {
    variables: {
      id: parseInt(window.location.pathname.split("/")[2]),
    },
  });
  const MUTATION = gql`
    mutation updatePerson(
      $id: Int!
      $name: String!
      $location: String!
      $image: String!
    ) {
      updatePerson(id: $id, name: $name, location: $location, image: $image) {
        name
        id
        location {
          name
        }
        image
      }
    }
  `;
  const DELETE = gql`
    mutation DeletePerson($id: Int!) {
      deletePerson(id: $id) {
        name
        id
        location {
          name
        }
        image
      }
    }
  `;
  const [deletePerson] = useMutation(DELETE);
  const [updatePerson, mutationData] = useMutation(MUTATION);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(e.target.image);
    if (e.target.name.value === "") {
      e.target.name.value = getCharacter.data.character.name;
    }
    if (e.target.location.value === "") {
      e.target.location.value = getCharacter.data.character.location.name;
    }
    if (e.target.image.value !== "") {
      // cloudinary image upload

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
      updatePerson({
        variables: {
          id: parseInt(window.location.pathname.split("/")[2]),
          name: e.target.name.value,
          location: e.target.location.value,
          image: data.secure_url,
        },
      });
    } else {
      updatePerson({
        variables: {
          id: parseInt(window.location.pathname.split("/")[2]),
          name: e.target.name.value,
          location: e.target.location.value,
          image: getCharacter.data.character.image,
        },
      });
    }
    setIsLoading(false);
  };
  const handleDelete = async (e: any) => {
    e.preventDefault();
    await deletePerson({
      variables: {
        id: parseInt(window.location.pathname.split("/")[2]),
      },
    });
    window.location.href = "/";
  };

  if (getCharacter.loading) return <p>Loading...</p>;
  if (getCharacter.error) return <p>Error :(</p>;
  if (mutationData.loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className="row mt-5">
        <div className="col-4">
          <div className="row ml-2">
            <div className="col">
              <div className="card ml-5">
                <div className="card-body">
                  <h5 className="card-title">
                    {getCharacter.data.character.name}
                  </h5>
                  <p className="card-text">
                    <strong>Location:</strong>{" "}
                    {getCharacter.data.character.location.name}
                  </p>
                  <div className="col">
                    <img
                      src={getCharacter.data.character.image}
                      alt={getCharacter.data.character.name}
                      className="card-img-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control mb-2"
                id="name"
                placeholder="Enter name"
                defaultValue={getCharacter.data.character.name}
              />
              <input
                type="hidden"
                className="form-control"
                id="id"
                defaultValue={getCharacter.data.character.id}
              />
              <input
                type="text"
                className="form-control mb-2"
                id="location"
                placeholder="Enter location"
                defaultValue={getCharacter.data.character.location.name}
              />
              <input
                type="file"
                className="form-control mb-2"
                id="image"
                accept="image/*"
              />
              <div className="row">
                <div className="col">
                  <button
                    type="submit"
                    className="btn btn-secondary form-control"
                  >
                    {isLoading ? (
                      <>
                        Loading...
                        <div
                          className="spinner-border text-light ml-2"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
                <div className="col">
                  <button
                    className="btn btn-danger form-control"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
