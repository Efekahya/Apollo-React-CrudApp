import { render, screen, waitFor } from "@testing-library/react"
import AddCharacter from "../AddCharacter"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import userEvent from "@testing-library/user-event"
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
})

test("renders AddCharacter component", () => {
  render(
    <ApolloProvider client={client}>
      <AddCharacter />
    </ApolloProvider>
  )
  expect(screen.getByTestId("form")).toBeInTheDocument()
  expect(screen.getByTestId("image")).toBeInTheDocument()
  expect(screen.getByTestId("id")).toBeInTheDocument()
  expect(screen.getByTestId("location")).toBeInTheDocument()
  expect(screen.getByTestId("button")).toBeInTheDocument()
  expect(screen.getByTestId("name")).toBeInTheDocument()
})
test("Adds a new character", async () => {
  render(
    <ApolloProvider client={client}>
      <AddCharacter />
    </ApolloProvider>
  )
  userEvent.type(screen.getByTestId("name"), "test")
  userEvent.type(screen.getByTestId("location"), "test")
  userEvent.upload(
    screen.getByTestId("image"),
    new File(["hello"], "./index.jpeg", {
      type: "image/jpeg",
    })
  )
  userEvent.click(screen.getByTestId("button"))

  await waitFor(() => {
    expect(screen.getByTestId("button")).toHaveTextContent(
      "Loading...Loading..."
    )
  }).then(async () => {
    await waitFor(() => {
      expect(screen.getByTestId("button")).toHaveTextContent("Success")
    })
  })
})
