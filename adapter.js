class RestAPI {
  fetchData() {
    return fetch("https://jsonplaceholder.typicode.com/posts").then(
      (response) => response.json()
    );
  }
}

class GraphQLAPI {
  fetchData() {
    return fetch("https://graphql-pokemon2.vercel.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "{ pokemons(first: 1) { id name } }",
      }),
    }).then((response) => response.json());
  }
}

class APIAdapter {
  constructor(api) {
    this.api = api;
  }

  fetchData() {
    if (this.api instanceof RestAPI) {
      return this.api.fetchData();
    } else if (this.api instanceof GraphQLAPI) {
      return this.api.fetchData();
    } else {
      throw new Error("Unsupported API type");
    }
  }
}

const restAPI = new RestAPI();
const graphqlAPI = new GraphQLAPI();
const restAdapter = new APIAdapter(restAPI);
const graphqlAdapter = new APIAdapter(graphqlAPI);

restAdapter.fetchData().then((data) => {
  console.log("Data from REST API:", data);
});

graphqlAdapter.fetchData().then((data) => {
  console.log("Data from GraphQL API:", data);
});
