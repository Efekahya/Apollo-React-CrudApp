import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import styles from "../styles.module.css"
export default function AddCharacter() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
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
  `

  const [add] = useMutation(ADD_CHARACTER)

  const handleSubmit = async (e: any) => {
    setIsLoading(true)
    e.preventDefault()
    const { name, location, image } = e.target.elements
    const formData = new FormData()
    formData.append("file", image.files[0])
    formData.append("upload_preset", "u8gn8k3a")
    const data = await fetch(
      "https://api.cloudinary.com/v1_1/ds4yfccnf/image/upload",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log(err)
        setError("Image Upload Failed")
      })

    add({
      variables: {
        name: name.value,
        location: location.value,
        image: data.secure_url,
      },
    }).catch((err) => {
      console.log(err)
      setError("Character Creation Failed")
    })
    setIsLoading(false)
    setError("Success")
  }
  return (
    <>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Add Character</h2>
          <div className={styles.input}>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter name"
              required
            />
          </div>
          <div className={styles.input}>
            <input
              type="hidden"
              className={styles.input}
              id="id"
              data-testid="id"
            />
          </div>
          <div className={styles.input}>
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              id="location"
              required
            />
          </div>
          <div className={styles.input}>
            <input
              type="file"
              name="file"
              id="image"
              accept="image/*"
              required
            />
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
  )
}
