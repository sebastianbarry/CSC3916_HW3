const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authJwtController = require('./auth_jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./Users');
const Movie = require("./Movies");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
const router = express.Router();

function getJSONObjectForMovieRequirement(req, msg)
{
    let json =
        {
        message: msg,
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null)
    {
        json.body = req.body;
    }

    if (req.headers != null)
    {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function (req, res)
{
    if (!req.body.username || !req.body.password)
    {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    }
    else
    {
        let user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.save(function (err)
        {
            if (err)
            {
                if (err.code === 11000)
                    return res.json({success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }
            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res)
{
    let userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;
    User.findOne({username: userNew.username}).select('name username password').exec(function (err, user)
    {
        if (err)
        {
            res.send(err);
        }
        user.comparePassword(userNew.password, function (isMatch)
        {
            if (isMatch)
            {
                let userToken = {id: user.id, username: user.username};
                let token = jwt.sign(userToken, process.env.SECRET_KEY, null, null);
                res.json({success: true, token: 'JWT ' + token});
            } else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

router.get("/movies", authJwtController.isAuthenticated, async (req, res) => {
    try {
      const movies = await Movies.find();
      if (req.query.reviews === "true") {
        Movies.aggregate(
          [
            {
              $match: { movie: movies.title },
            },
            {
              $lookup: {
                from: "reviews",
                localField: "movie",
                foreignField: "movie",
                as: "Review",
              },
            },
          ],
          (error, result) => {
            if (error) {
              return res.status(500).json(error);
            }
            return res
              .status(200)
              .json({ success: true, msg: "Movie with reviews found", result });
          }
        );
      }
      return res.status(200).json(movies);
    } catch (error) {
      return res.status(500).json(error);
    }
  });
  
  router.post("/movies", authJwtController.isAuthenticated, (req, res) => {
    const { title, year, genre, actors } = req.body;
    if (!actors || actors.length < 3) {
      return res
        .status(500)
        .json({ success: false, msg: "Must have at least 3 actors" });
    }
    Movies.create(
      {
        title,
        year,
        genre,
        actors,
      },
      (error, movie) => {
        if (error) {
          return res.status(500).json(error);
        }
        return res
          .status(200)
          .json({ success: true, msg: "Movie created", movie });
      }
    );
  });
  
  router.get(
    "/movie/:movieID",
    authJwtController.isAuthenticated,
    async (req, res) => {
      try {
        const movie = await Movies.findById(req.params.movieID);
        if (!movie) {
          return res.status(500).json("Movie does not exists");
        }
        if (req.query.reviews === "true") {
          Movies.aggregate(
            [
              {
                $match: { title: movie.title },
              },
              {
                $lookup: {
                  from: "reviews",
                  localField: "title",
                  foreignField: "movie",
                  as: "Reviews",
                },
              },
            ],
            (error, movie) => {
              if (error) {
                return res.status(500).json(error);
              }
              return res
                .status(200)
                .json({ success: true, msg: "Movie with reviews found", movie });
            }
          );
        } else {
          return res
            .status(200)
            .json({ success: true, msg: "Movie found", movie });
        }
      } catch (error) {
        return res.status(500).json(error);
      }
    }
  );
  router.put("/movie/:movieID", authJwtController.isAuthenticated, (req, res) => {
    const { title, year, genre, actors } = req.body;
    if (!actors || actors.length < 3) {
      return res
        .status(500)
        .json({ success: false, msg: "Must have at least 3 actors" });
    }
  
    Movies.findByIdAndUpdate(
      req.params.movieID,
      {
        $set: { title: title, year: year, genre: genre, actors: actors },
      },
      { new: true }
    ).exec((error, movie) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json({ success: true, msg: "Movie updated", movie });
    });
  });
  router.delete(
    "/movie/:movieID",
    authJwtController.isAuthenticated,
    async (req, res) => {
      try {
        const movie = await Movies.findByIdAndDelete(req.params.movieID);
        return res.status(200).json(`${movie.title} has been deleted`);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
  );
  
  router.get("/reviews", async (req, res) => {
    try {
      const reviews = await Reviews.find();
      if (!reviews) {
        return res.json(500).json("No Reviews");
      }
  
      return res.status(200).json(reviews);
    } catch (error) {
      return res.json(500).json(error);
    }
  });
  router.post("/reviews", authJwtController.isAuthenticated, async (req, res) => {
    const { movie, reviewer, quote, rating } = req.body;
    if (!movie || !reviewer || !quote || !rating) {
      return res.status(500).json({ success: false, msg: "Missing information" });
    }
    try {
      const movieFound = await Movies.findOne({ title: movie });
  
      if (!movieFound) {
        return res.status(404).json("Movie does not exist");
      }
      Reviews.create(
        {
          movie,
          reviewer,
          quote,
          rating,
        },
        (error, review) => {
          if (error) {
            return res.status(500).json(error);
          }
          return res
            .status(200)
            .json({ success: true, msg: "Review created", review });
        }
      );
    } catch (error) {
      res.status(500).json(error);
    }
  });


app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only
