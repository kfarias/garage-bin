const enviroment = process.env.NODE_ENV || 'development';

const express = require('express');
const bodyParser = require('body-parser');
const configuration = require('./knexfile')[enviroment];
const database = require('knex')(configuration);
const fs = require('fs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Garage Bin';


app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file);
  });
});

app.get('/api/v1/items', (request, response) => {
  database('items').select()
  .then((items) => {
    response.status(200).json(items);
  })
  .catch((error) => {
    response.sendStatus(500).send({ error });
  });
});

app.get('/api/v1/items/sort', (request, response) => {
  database('items').select().orderBy('name', 'asc')
  .then((items) => {
    response.status(200).json(items);
  })
  .catch((error) => {
    response.sendStatus(500).send({ error });
  });
});

app.get('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;
  database('items').select().where('id', id)
    .then((items) => {
      if (!items.length) {
        response.status(404).send({ error: 'No items!' });
      } else {
        response.status(200).json(items);
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

app.post('/api/v1/items', (request, response) => {
  const correctBody = ['name', 'whyItStays', 'cleanliness'].every(param => request.body[param]);
  const { name, whyItStays, cleanliness } = request.body;

  if (!correctBody) {
    return response.status(422).send({ error: 'You are missing content in your request' });
  }
  database('items').insert({ name, whyItStays, cleanliness }, ['id', 'name', 'whyItStays', 'cleanliness'])
      .then((addedItems) => {
        response.status(201).send(addedItems[0]);
      })
      .catch((error) => {
        response.status(500).send({ error });
      });
});

app.put('/api/v1/items/:id/edit', (request, response) => {
  const { id } = request.params;
  const { cleanliness } = request.body;

  if (!cleanliness) {
    return response.status(404).send('Sorry you did not pass in the correct info');
  }
  database('items').where('id', id).update({ cleanliness })
    .then(() => {
      database('items').where('id', id).select()
      .then((items) => {
        response.status(200).json(items);
      })
      .catch((error) => {
        response.status(500).send({ error });
      });
    });
});

app.delete('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;
  database('items').where('id', id).del()
  .then(() => {
    database('items').select()
    .then((items) => {
      response.status(204).json(items);
    })
    .catch((error) => {
      response.status(404).send('resource not found');
    });
  });
});


if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;
