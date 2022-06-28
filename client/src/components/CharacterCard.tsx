import { useEffect, useState } from "react"
import { useQuery, gql } from "@apollo/client"
import styles from "../styles.module.css"
export default function CharacterCard() {
  const [character, setCharacter] = useState<Array<any>>([])
  const [PAGE, setPAGE] = useState<number>(0)
  const [selection, setSelection] = useState<number>(0)

  useEffect(() => {
    setPAGE(0)
  }, [selection])
  const GET_CHARACTER = gql`
    query GetCharacter($page: Int!, $limit: Int!) {
      characters(page: $page, limit: $limit) {
        name
        id
        location {
          name
        }
        image
        gender
      }
    }
  `
  const GET_RICK = gql`
    query GetCharacter($page: Int!, $limit: Int!) {
      ricks(page: $page, limit: $limit) {
        name
        id
        location {
          name
        }
        image
      }
    }
  `
  const GET_MORTY = gql`
    query GetCharacter($page: Int!, $limit: Int!) {
      mortys(page: $page, limit: $limit) {
        name
        id
        location {
          name
        }
        image
      }
    }
  `

  const GET_FILTER = gql`
    query GetFilter($page: Int!, $limit: Int!, $name: String!) {
      filter(page: $page, limit: $limit, name: $name) {
        name
        id
        location {
          name
        }
        image
        gender
      }
    }
  `

  const all = useQuery(GET_CHARACTER, {
    variables: {
      page: PAGE,
      limit: 20,
    },
    skip: selection !== 0,
  })
  const ricks = useQuery(GET_RICK, {
    variables: {
      page: PAGE,
      limit: 20,
    },
    skip: selection !== 1,
  })
  const mortys = useQuery(GET_MORTY, {
    variables: {
      page: PAGE,
      limit: 20,
    },
    skip: selection !== 2,
  })

  const filter = useQuery(GET_FILTER, {
    variables: {
      page: PAGE,
      limit: 20,
      name: "summer",
    },
  })
  if (all.error) {
    console.log(all.error)
    return <p>Error :(</p>
  }
  if (all.data && character.length === 0) {
    //? USE EFFECT IS NOT RELIABLE SO WE NEED TO USE STATE
    setCharacter(all.data.characters)
  }
  window.onscroll = (e) => {
    e.preventDefault()

    console.log("SCROLL", PAGE)
    if (PAGE === 0) {
      setPAGE(PAGE + 1)
    }
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPAGE(PAGE + 1)
      if (selection === 0) {
        all.refetch({
          page: PAGE,
          limit: 20,
        })
        setCharacter([...character, ...all.data.characters])
      }
      if (selection === 1) {
        ricks.refetch({
          page: PAGE,
          limit: 20,
        })
        setCharacter([...character, ...ricks.data.ricks])
      }
      if (selection === 2) {
        mortys.refetch({
          page: PAGE,
          limit: 20,
        })
        setCharacter([...character, ...mortys.data.mortys])
      }
    }
  }

  const handleClick = async (e: any) => {
    console.log("OUTER", PAGE)
    if (e.target.id === "rick") {
      setSelection(1)
      let newRicks = await ricks.refetch({
        page: 0,
        limit: 20,
      })
      setCharacter(newRicks.data.ricks)
    }
    if (e.target.id === "morty") {
      setSelection(2)
      let newMortys = await mortys.refetch({
        page: 0,
        limit: 20,
      })

      setCharacter(newMortys.data.mortys)
    }
    if (e.target.id === "filter") {
      setSelection(3)
      let newFilter = await filter.refetch({
        page: 0,
        limit: 20,
        name: "Summer",
      })

      setCharacter(newFilter.data.filter)
    }
    if (e.target.id === "all") {
      setSelection(0)
      let newAll = await all.refetch({
        page: 0,
        limit: 20,
      })
      setCharacter(newAll.data.characters)
    }
  }
  const handleAddCharacter = () => {
    window.location.href = "/add"
  }

  return (
    <div className={styles.container}>
      {character && (
        <span data-testid="scroll">
          <div className="dropdown mb-2">
            <button
              className="btn btn-dark dropdown-toggle mb-2"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Filter
            </button>
            <button
              className={"btn btn-dark ml-2 mb-2"}
              id="newCharacter"
              onClick={handleAddCharacter}
              data-testid="newCharacter"
            >
              Add New Character
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <button
                  id="all"
                  className="dropdown-item"
                  onClick={handleClick}
                >
                  All characters
                </button>
              </li>
              <li>
                <button
                  id="rick"
                  className="dropdown-item"
                  onClick={handleClick}
                  data-testid="ricks"
                >
                  Ricks
                </button>
              </li>
              <li>
                <button
                  id="morty"
                  className="dropdown-item"
                  onClick={handleClick}
                >
                  Mortys
                </button>
              </li>
              <li>
                <button
                  id="filter"
                  className="dropdown-item"
                  onClick={handleClick}
                >
                  Summer
                </button>
              </li>
            </ul>
          </div>
          <div className={styles.items}>
            {character.map(
              (character: {
                id: number
                image: string
                name: string
                location: { name: string; url: string }
                gender: string
              }) => {
                return (
                  <>
                    <div className={styles.item}>
                      <div className={styles.img}>
                        <img
                          src={character.image}
                          alt="avatar"
                          style={{
                            width: "100%",
                          }}
                        />
                      </div>
                      <div className={styles.content}>
                        <div className={styles.id}>
                          <div>
                            <span className={styles["id-title"]}>#id: </span>{" "}
                            {character.id}
                          </div>
                          <div>
                            <a
                              href={"edit/" + character.id}
                              className={styles["edit-btn"]}
                            >
                              Edit
                            </a>
                          </div>
                        </div>
                        <div className={styles.details}>
                          <div className={styles.name}>
                            <span className={styles["detail-title"]}>
                              Name:{" "}
                            </span>{" "}
                            {character.name}
                          </div>
                          <div className={styles.location}>
                            <span className={styles["detail-title"]}>
                              Location:{" "}
                            </span>{" "}
                            {character.location.name}
                          </div>
                          <div className={styles.location}>
                            <span className={styles["detail-title"]}>
                              Gender:{" "}
                            </span>{" "}
                            {character.gender}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              }
            )}
          </div>
        </span>
      )}
    </div>
  )
}

