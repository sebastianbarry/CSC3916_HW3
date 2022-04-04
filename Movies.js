var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

try
{
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error)
{
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

let MovieSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      enum: [
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Fantasy",
        "Horror",
        "Thriller",
        "Western",
      ],
    },
    actors: [
      {
        actorName: {
          type: String,
          required: true,
        },
        characterName: {
          type: String,
          required: true,
        },
      },
    ],
  });

module.exports = mongoose.model('Movie', MovieSchema);
