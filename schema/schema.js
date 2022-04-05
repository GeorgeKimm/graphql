// импорт graphql
const graphql = require("graphql");

// GraphqlObjectType с его помощью описывается схема данных хранящихся в базе
// GraphqlString - импортируемый тип из graphql
// GraphQLID - импортируемый специальный тип для из graphql
// GraphQLList - используется для выведения списка элементов
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// экземпляры mongoose схемы
const Movies = require("../models/movie");
const Directors = require("../models/director");

// const moviesJson = [
//   { "name": "pulp fiction", "genre": "crime", "directorID": },
//   { "name": "reservoir dogs", "genre": "crime", "directorID": },
//   { "name": "kill Bill", "genre": "action", "directorID": },
//   { "name": "finding Nemo", "genre": "cartoon", "directorID": },
//   { "name": "star wars", "genre": "science-fiction films", "directorID": },
//   { "name": "cast away", "genre": "dram", "directorID": },
// ];

// const directorsJson = [
//   { "name": "Andrew Stanton", "born": 1965 }, // "618dee980cf0b77a02aefcac"
//   { "name": "Quentin Tarantino", "born": 1963 }, // "618defe10cf0b77a02b04636"
//   { "name": "Robert Lee Zemeckis", "born": 1951 }, // "618df01a0cf0b77a02b0828d"
//   { "name": "George Lucas", "born": 1944 }, // "618df03c0cf0b77a02b0a805"
// ];

// const movies = [
//   { id: "1", name: "pulp fiction", genre: "crime", directorID: 2 },
//   { id: "2", name: "reservoir dogs", genre: "crime", directorID: 2 },
//   { id: "3", name: "kill Bill", genre: "action", directorID: 2 },
//   { id: 4, name: "finding Nemo", genre: "cartoon", directorID: 1 },
//   { id: 5, name: "star wars", genre: "science-fiction films", directorID: 4 },
//   { id: "6", name: "cast away", genre: "dram", directorID: 3 },
// ];

// const directors = [
//   { id: 1, name: "Andrew Stanton", born: 1965 },
//   { id: 2, name: "Quentin Tarantino", born: 1963 },
//   { id: 3, name: "Robert Lee Zemeckis", born: 1951 },
//   { id: 4, name: "George Lucas", born: 1944 },
// ];

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    born: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies.filter((movie) => movie.directorID == parent.id);
        return Movies.find({ directorID: parent.id }); // // возвращение фильмов с помощью метода find библиотеки mongoose
      },
    },
  }),
});

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    // тут спецом указывается просто имя director, потому-что описывается объект, а не id
    director: {
      type: DirectorType,
      resolve(parent, args) {
        // return directors.find((director) => director.id == parent.directorID);
        return Directors.findById(parent.directorID); // возвращение режиссера с помощью метода findById библиотеки mongoose
      },
    },
  }),
});

// создание и описание запроса
// Мы не можем просто взять и экспортировать схему из файла в файл сервер js
// нужно указать чтобы наше приложение при загрузке страницы обращалось к graphql
// который в свою очередь должен запросить все необходимые данные

// с помощью GraphQLObjectType описывается новый объект query
// внутри корневого запроса описываются все подзапросы(в данном случае 1 подзапрос с именем movie)
// в самом подзапросе описывается, что он должен содержать
const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } }, // свойство которое описывает какие аргументы принимает запрос
      // внутри метода resolve, описываются какие данные должны возвращаться
      resolve(parent, args) {
        // return movies.find((movie) => movie.id == args.id);
        return Movies.findById(args.id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return directors.find((director) => director.id == args.id);
        return Directors.findById(args.id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies;
        return Movies.find({});
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        // return directors;
        return Directors.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: GraphQLString },
        born: { type: GraphQLInt },
      },
      resolve(parent, args) {
        // с помощью mongoose схемы создается новая сущность
        const director = new Directors({
          name: args.name,
          born: args.born,
        });
        // далее с помощью метода save созданный экземпляр сохраняется в базу
        // save это метод mongoose
        return director.save();
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorID: { type: GraphQLID },
      },
      resolve(parent, args) {
        // с помощью mongoose схемы создается новая сущность
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorID: args.directorID,
        });
        // далее с помощью метода save созданный экземпляр сохраняется в базу
        // save это метод mongoose
        return movie.save();
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Directors.findByIdAndRemove(args.id);
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movies.findByIdAndRemove(args.id);
      },
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        born: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return Directors.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, born: args.born } },
          { new: true }
        );
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorID: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Movies.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              genre: args.genre,
              directorID: args.directorID,
            },
          },
          { new: true }
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
