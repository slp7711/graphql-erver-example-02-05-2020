const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const Book = require('./models/book');
require('dotenv').config();

mongoose.connect(process.env.MONGO_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
  console.log('Connected to db');
});

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }

    type Query {
        books: [Book]
    }

    type Mutation {
      addBook(title: String!, author: String!): Book
    }

`;

/* const books = [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
    },
  ]; */

  const resolvers = {
      Query: {
          //books: () => books,
          books: () => Book.find({}),
      },
      Mutation: {
        addBook: (parent, args) => {
          let book = new Book({
            title: args.title,
            author: args.author
          });
          return book.save(); //without the return it´ll save in db but return nothing
        }
      },
  };

  const server = new ApolloServer({typeDefs, resolvers});

  server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`);
  });