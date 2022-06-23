import { render, screen, waitFor } from "@testing-library/react"
import CharacterCard from "../CharacterCard"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import userEvent from "@testing-library/user-event"

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
})

test("renders CharacterCard component", async () => {
  render(
    <ApolloProvider client={client}>
      <CharacterCard />
    </ApolloProvider>
  )
  expect(screen.getByText("Filter")).toBeInTheDocument()
  expect(screen.getByText("Add New Character")).toBeInTheDocument()
  //wait for the data to load
  await waitFor(() => {
    let count = screen.getAllByTestId("character").length
    expect(count).toBe(20)
  })
})

test("renders CharacterCard component with filter", async () => {
  render(
    <ApolloProvider client={client}>
      <CharacterCard />
    </ApolloProvider>
  )
  expect(screen.getByText("Filter")).toBeInTheDocument()
  expect(screen.getByText("Add New Character")).toBeInTheDocument()
  //wait for the data to load
  await waitFor(() => {
    let count = screen.getAllByTestId("character").length
    expect(count).toBe(20)
  })
  userEvent.click(screen.getByTestId("ricks"))
  await waitFor(() => {
    let count = screen.getAllByTestId("character").length
    expect(count).toBe(20)
  })
})
