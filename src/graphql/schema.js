import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList, GraphQLNonNull
} from 'graphql';

import GraphQLJSON from 'graphql-type-json'

const companyData = [
  { id: 1, name: 'ABC Inc.' },
  { id: 2, name: 'Foo LLC' },
  { id: 3, name: 'A Taco Truck' },
];

const peopleData = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sara Smith' },
  { id: 3, name: 'Budd Deey' },
];

const SearchResultType = new GraphQLObjectType({
  name: 'SearchResult',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    params: { type: GraphQLJSON }
  }
});

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    search: {
      type: SearchResultType,
      args: {
        attributes: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          params: { type: new GraphQLNonNull(GraphQLJSON) },
        }
      },
      resolve: (parent, args, context, info) => {
        const person =  peopleData.find(user => user.id.toString() === args.params.id.toString());
        return {
          ...person,
          id: args.id,
          params: args.params
        }
      }
    },
  },
});

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData,
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args, context, info) => {
        return companyData.find(company => company.id.toString() === args.id.toString());
      }
    },
    person: {
      type: PersonType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        // params: { type: GraphQLJSON }
      },
      resolve: (parent, args, context, info) => {
        return peopleData.find(user => user.id.toString() === args.id);
      }
    }
  },
});

export const schema = new GraphQLSchema({ query: QueryType });
