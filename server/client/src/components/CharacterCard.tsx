import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

export default function CharacterCard() {
  const [character, setCharacter] = useState<Array<any>>([]);
  const [PAGE, setPAGE] = useState<number>(0);
  const [selection, setSelection] = useState<number>(0);

  useEffect(() => {
    setPAGE(0);
  }, [selection]);
  const GET_CHARACTER = gql`
    query GetCharacter($page: Int!, $limit: Int!) {
      characters(page: $page, limit: $limit) {
        name
        id
        location {
          name
        }
        image
      }
    }
  `;
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
  `;
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
  `;

  const all = useQuery(GET_CHARACTER, {
    variables: {
      page: PAGE,
      limit: 20,
    },
    skip: selection !== 0,
  });
  const ricks = useQuery(GET_RICK, {
    variables: {
      page: PAGE,
      limit: 20,
    },
    skip: selection !== 1,
  });
  const mortys = useQuery(GET_MORTY, {
    variables: {
      page: PAGE,
      limit: 20,
    },
    skip: selection !== 2,
  });

  if (all.error) {
    console.log(all.error);
    return <p>Error :(</p>;
  }
  if (all.data && character.length === 0) {
    //? USE EFFECT IS NOT RELIABLE SO WE NEED TO USE STATE
    setCharacter(all.data.characters);
  }
  window.onscroll = (e) => {
    e.preventDefault();

    console.log("SCROLL", PAGE);
    if (PAGE === 0) {
      setPAGE(PAGE + 1);
    }
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPAGE(PAGE + 1);
      if (selection === 0) {
        all.refetch({
          page: PAGE,
          limit: 20,
        });
        setCharacter([...character, ...all.data.characters]);
      }
      if (selection === 1) {
        ricks.refetch({
          page: PAGE,
          limit: 20,
        });
        setCharacter([...character, ...ricks.data.ricks]);
      }
      if (selection === 2) {
        mortys.refetch({
          page: PAGE,
          limit: 20,
        });
        setCharacter([...character, ...mortys.data.mortys]);
      }
    }
  };

  const handleClick = async (e: any) => {
    console.log("OUTER", PAGE);
    if (e.target.id === "rick") {
      setSelection(1);
      let newRicks = await ricks.refetch({
        page: 0,
        limit: 20,
      });
      setCharacter(newRicks.data.ricks);
    }
    if (e.target.id === "morty") {
      setSelection(2);
      let newMortys = await mortys.refetch({
        page: 0,
        limit: 20,
      });

      setCharacter(newMortys.data.mortys);
    }
    if (e.target.id === "all") {
      setSelection(0);
      let newAll = await all.refetch({
        page: 0,
        limit: 20,
      });
      setCharacter(newAll.data.characters);
    }
  };
  const handleEdit = (e: any) => {
    window.location.href = `/edit/${e.target.id}`;
  };
  const handleAddCharacter = () => {
    window.location.href = "/add";
  };
  let map = character.map(
    (character: {
      id: number;
      image: string;
      name: string;
      location: { name: string; url: string };
    }) => {
      return (
        <>
          <div className="col" key={character.id}>
            <div className="card border border-3 border-secondary rounded text-white bg-dark mb-2">
              <div className="row w-100">
                <div className="col-2">
                  <img
                    src={character.image}
                    className="img rounded"
                    style={{ width: "100px", height: "100px" }}
                    alt="character"
                  />
                </div>
                <div className="col-8">
                  <div className="card-body">
                    <h5 className="card-title">#ID: {character.id}</h5>
                    <p className="card-text">
                      <b>{character.name}</b> is from{" "}
                      <b>{character.location.name}</b>
                    </p>
                  </div>
                </div>
                <div className="col align-self-center">
                  <button
                    id={character.id.toString()}
                    className="btn bg-secondary align-self-center"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  );

  return (
    <div className="container ">
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle mb-2"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Filter
        </button>
        <button
          className="btn btn-secondary ml-2 mb-2"
          id="newCharacter"
          onClick={handleAddCharacter}
        >
          Add New Character
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <button id="all" className="dropdown-item" onClick={handleClick}>
              All characters
            </button>
          </li>
          <li>
            <button id="rick" className="dropdown-item" onClick={handleClick}>
              Ricks
            </button>
          </li>
          <li>
            <button id="morty" className="dropdown-item" onClick={handleClick}>
              Mortys
            </button>
          </li>
        </ul>
      </div>
      {character && <div className="row row-cols-2">{map}</div>}
    </div>
  );
}
