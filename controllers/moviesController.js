
import CustomError from "../classes/CustomError.js";
import connection from "../connection.js";

function index(req, res) {

  const sql = `SELECT movies.*, AVG(reviews.vote) AS vote_average, COUNT(reviews.text) AS comments_number FROM movies
    LEFT JOIN  reviews
    ON reviews.movie_id = movies.id
    GROUP BY movies.id`;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({
      error: "Database query failed"
    })
    console.log(results)
    let items = results;
    const response = {
      totalCount: results.length,
      items
    };
    res.json(response);
  })
}

function show(req, res) {
  const id = parseInt(req.params.id);
  const sql = `SELECT movies.*, AVG(reviews.vote) AS vote_average, COUNT(reviews.text) AS comments_number FROM movies
    LEFT JOIN reviews
    ON reviews.movie_id = movies.id
    WHERE movies.id = ?
    GROUP BY movies.id`;

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({
      error: "Database query failed"
    })

    const item = results[0];
    if (!item) {
      return res.status(404).json({
        error: "L'elemento non esiste"
      })

    }

    const sqlreviews = "SELECT * FROM reviews WHERE movie_id = ?"

    connection.query(sqlreviews, [id], (err, reviews) => {
      console.log(reviews)
      if (err) return res.status(500).json({
        error: "Database query failed"
      })


      item.reviews = reviews;
      res.json({ success: true, item });
    })

  })
}

// function store(req, res) {
//   let newId = 0;
//   for (let i = 0; i < movies.length; i++) {
//     if (movies[i].id > newId) {
//       newId = movies[i].id;
//     }
//   }
//   newId += 1;
//   console.log(req.body);


//   if (!req.body.published) {
//     throw new CustomError("Pubblica non cliccato", 500);
//   }

//   if (!req.body.title || !req.body.content || !req.body.image || !req.body.category) {
//     throw new CustomError("Uno dei campi risulta vuoto", 500);
//   }
//   const newItem = {
//     id: newId,
//     ...req.body,
//   };

//   movies.push(newItem);
//   res.status(201).json(newItem);
// }

function store(req, res) {

  const { id } = req.params;

  const { text, name, vote } = req.body;

  const sql = `INSERT INTO reviews (text, name, vote, movie_id) VALUES (?, ?, ?, ?)`

  connection.query(sql, [text, name, vote, id], (err, results) => {
    if (err) return res.status(500).json({
      error: "Database query failed"
    })
    res.status(201);

    res.json({
      message: "Review added",
      id: results.insertId
    })
  })
}



function update(req, res) {
  const id = parseInt(req.params.id);
  const item = movies.find((item) => item.id === id);
  if (!item) {
    throw new CustomError("L'elemento non esiste", 404);
  }

  for (key in item) {
    if (key !== "id") {
      item[key] = req.body[key];
    }
  }

  res.json(item);
}
function destroy(req, res) {
  const id = parseInt(req.params.id);
  const sql = "DELETE FROM `movies` WHERE `id` = ?";
  connection.query(sql, [id], (err) => {
    if (err) return res.status(500).json({
      error: "Database query failed"
    })
    res.sendStatus(204)


  })
}

export { index, show, store, update, destroy };
