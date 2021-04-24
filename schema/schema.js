const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLString},
        title: {type: GraphQLString},
        author: {type: GraphQLString},
        author: {type: GraphQLString},
        pages: {type: GraphQLString},
        isbn: {type: GraphQLString},
        owner: {type: GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType, 
            args: {id:{ type: GraphQLString }},
            resolve(parent, args) {
                // Code to get data from data source.
                
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});