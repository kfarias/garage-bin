const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const enviroment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[enviroment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Garage Bin';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('lib'));

app.get('/', (request, response ) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
});

//get all items in garage
app.get('/api/v1/items', (request, response) => {
  database('items').select()
  .then(items => {
    response.status(200).json(items);
  })
  .catch(error => {
    response.sendStatus(500).send({ error });
  });
})

// get a single item in the garage

app.get('/api/v1/items/:id', (request, response) => {
  const { id } = request.params
  database('items').select().where('id', id)
    .then((items) => {
      if (!items.length) {
        response.status(404).send({ error: 'No items!' });
      } else {
        response.status(200).json(items)
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});


// add a new thing to garage

app.post('/api/v1/items', (request, response) => {
    const correctBody = [ 'name', 'whyItStays', 'cleanliness' ].every(param => request.body[param]);
    const { name, whyItStays, cleanliness } = request.body;

    if (!correctBody) {
      return response.status(422).send({ error: 'You are missing content in your request' });
    }
    database('items').insert({ name, whyItStays, cleanliness }, [ 'id', 'name', 'whyItStays', 'cleanliness' ])
      .then((addedItems) => {
        response.status(200).send(addedItems[0]);
      })
      .catch((error) => {
        response.status(500).send({ error });
      });
});

// update the cleanliness by passing in same entry of an item in the garage

app.put('/api/v1/items/:id/edit', (request, response) => {
  const { id } = request.params;
  const { cleanliness } = request.body;

  if (!cleanliness) {
    return response.status(422).send('Sorry you did not pass in the correct info')
  }
  database('items').where('id', id).update({ cleanliness: cleanliness })
    .then(() => {
      database('items').where('id', id).select()
      .then((items) => {
        response.status(200).json(items);
      })
      .catch((error) => {
        response.status(500).send({ error })
      })
    });
})











































app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app
