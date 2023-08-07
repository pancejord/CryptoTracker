const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");
require("dotenv").config();

const PORT = 4000;
const CryptoApi = process.env.CRYPTO_API;

const typeDefs = gql `

type Coin  {
  id: ID!,
  name: String!,
  symbol: String!,
  price: Float!,
  
}

type Query {
  coins: [Coin!]!
  }
`

const resolvers = {
  Query: {
    coins: async () => {
      try {
        const response = await axios.get(
          "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
          {
            headers: {
              "X-CMC_PRO_API_KEY": CryptoApi,
            },
          }
        );

        const { data } = response;
        const coins = data.data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: parseFloat(coin.quote.USD.price),
        }));

        return coins;
      } catch (error) {
        throw new Error("Failed to fetch coin data");
      }
    },
  },
};


//Create an instance of Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server on specific URL
server.listen(PORT, "localhost").then(() => {
  console.log(`Server running at http://localhost:${PORT}`);
});



