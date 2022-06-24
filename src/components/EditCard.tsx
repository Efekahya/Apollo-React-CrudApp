import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import styles from "../styles.module.css"
export default function EditCard() {
  const [isLoading, setIsLoading] = useState(false)
  console.log(window.location.pathname.split("/")[2])
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
  `
  const getCharacter = useQuery(GET_CHARACTER, {
    variables: {
      id: parseInt(window.location.pathname.split("/")[2]),
    },
  })
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
  `
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
  `
  const [deletePerson] = useMutation(DELETE)
  const [updatePerson, mutationData] = useMutation(MUTATION)
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    console.log(e.target.image)
    if (e.target.name.value === "") {
      e.target.name.value = getCharacter.data.character.name
    }
    if (e.target.location.value === "") {
      e.target.location.value = getCharacter.data.character.location.name
    }
    if (e.target.image.value !== "") {
      // cloudinary image upload

      const formData = new FormData()
      formData.append("file", e.target.image.files[0])
      formData.append("upload_preset", "u8gn8k3a")
      const data = await fetch(
        "https://api.cloudinary.com/v1_1/ds4yfccnf/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json())
      console.log(data)
      updatePerson({
        variables: {
          id: parseInt(window.location.pathname.split("/")[2]),
          name: e.target.name.value,
          location: e.target.location.value,
          image: data.secure_url,
        },
      })
    } else {
      updatePerson({
        variables: {
          id: parseInt(window.location.pathname.split("/")[2]),
          name: e.target.name.value,
          location: e.target.location.value,
          image: getCharacter.data.character.image,
        },
      })
    }
    setIsLoading(false)
  }
  const handleDelete = async (e: any) => {
    e.preventDefault()
    await deletePerson({
      variables: {
        id: parseInt(window.location.pathname.split("/")[2]),
      },
    })
    window.location.href = "/"
  }

  if (getCharacter.loading) return <p>Loading...</p>
  if (getCharacter.error) return <p>Error :(</p>
  if (mutationData.loading) {
    return <p>Loading...</p>
  }
  return (
    <>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.image}>
            <img src={getCharacter.data.character.image} alt="avatar" />
          </div>
          <div className={styles.input}>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              defaultValue={getCharacter.data.character.name}
            />
          </div>
          <div className={styles.input}>
            <input
              type="text"
              name="location"
              id="location"
              placeholder="Enter location"
              defaultValue={getCharacter.data.character.location.name}
            />
          </div>
          <div className={styles.input}>
            <input type="file" name="file" id="image" accept="image/*" />
          </div>

          <div className={styles["form-button"]}>
            <button type="submit">
              {isLoading ? (
                <>
                  Loading...
                  <div className="spinner-border text-light ml-2" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
          <div
            className={
              styles["form-button"] + " " + styles["red-btn"] + " mt-2"
            }
          >
            <button type="submit" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
