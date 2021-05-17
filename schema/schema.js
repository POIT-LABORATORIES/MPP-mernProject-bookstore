const graphql = require("graphql");
const Book = require("../models/Book");
const User = require("../models/User");

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        author: {type: GraphQLString},
        pages: {type: GraphQLString},
        isbn: {type: GraphQLString},
        owner: {type: GraphQLID}
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        books: {
            type: new GraphQLList(BookType),
            async resolve(parent, args) {
                return await Book.find({ owner: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType, 
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Book.findById(args.id);
            }
        },
        user: {
            type: UserType, 
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await User.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType), 
            args: { ownerId: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Book.find({ owner: args.ownerId });
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLString)},
                author: {type: new GraphQLNonNull(GraphQLString)},
                pages: {type: new GraphQLNonNull(GraphQLString)},
                isbn: {type: new GraphQLNonNull(GraphQLString)},
                owner: {type: new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args) {
                const book = new Book({
                    title: args.title,
                    author: args.author,
                    pages: args.pages,
                    isbn: args.isbn,
                    owner: args.owner
                });
                return await book.save();
            }
        },
        deleteBook: {
            type: BookType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args) {
                return await Book.findByIdAndDelete(args.id);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});