import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
export default function AddCharacter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
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

  const [add] = useMutation(ADD_CHARACTER);

  const handleSubmit = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    const { name, location, image } = e.target.elements;
    const formData = new FormData();
    formData.append("file", image.files[0]);
    formData.append("upload_preset", "u8gn8k3a");
    const data = await fetch(
      "https://api.cloudinary.com/v1_1/ds4yfccnf/image/upload",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
        setError("Image Upload Failed");
      });

    add({
      variables: {
        name: name.value,
        location: location.value,
        image: data.secure_url,
      },
    }).catch((err) => {
      console.log(err);
      setError("Character Creation Failed");
    });
    setIsLoading(false);
    setError("Success");
  };
  return (
    <>
      <div className="col-5 ">
        <form onSubmit={handleSubmit} id="form" data-testid="form">
          <div className="form-group">
            <input
              type="text"
              className="form-control mb-2"
              id="name"
              data-testid="name"
              placeholder="Enter name"
              required
            />
            <input
              type="hidden"
              className="form-control"
              id="id"
              data-testid="id"
            />
            <input
              type="text"
              className="form-control mb-2"
              id="location"
              data-testid="location"
              placeholder="Enter location"
              required
            />
            <input
              type="file"
              className="form-control mb-2"
              id="image"
              data-testid="image"
              accept="image/*"
              required
            />
            <button
              type="submit"
              className="btn btn-secondary form-control"
              data-testid="button"
            >
              {isLoading ? (
                <>
                  Loading...
                  <div className="spinner-border text-light ml-2" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : error ? (
                error
              ) : (
                "Add Character"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
