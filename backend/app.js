'use strict';
require('dotenv').config();
const Response = require('./response')

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');
const fs = require('fs')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database!'));

const app = express();

app.use(cors());
app.use(bodyParser.json());

var data = [];

app.post('/store-data', async (req, res) => {

    // Empty the database by deleting the existing responses
    db.collection('responses').deleteMany({});

    // Insert the responses into the MongoDB collection
    for (let i = 0; i< 37; i++) {
        if (req.body[JSON.stringify(i)]) {
            const response_instance = new Response({
                questionNumber: req.body[JSON.stringify(i)].Id,
                question: req.body[JSON.stringify(i)].question,
                response: req.body[JSON.stringify(i)].response
            })
            try {
                const newResponse = await response_instance.save()
            } catch (error) {
                res.status(400).json({ message: error.message})
                return
            }
        }
    }

    // Create the fields for the CSV file
    const fields = [
        {
          label: '_id',
          value: '_id'
        },
        {
          label: 'Question Number',
          value: 'questionNumber'
        },
        {
         label: 'Question',
          value: 'question'
        },
        {
          label: 'Response',
           value: 'response'
         },
         {
          label: '__v',
           value: '__v'
         }
      ];

    // Extract the responses from the MongoDB collection and write them to a CSV file 'data.csv'
    db.collection('responses').find().toArray(function(err, docs) {

        data = JSON.parse(JSON.stringify(docs));

        const json2csv = new Parser({ fields: fields });

        try {
            const csv = json2csv.parse(data)
            fs.writeFile('data.csv', csv, { flag: 'w+' }, err => {
                if (err) {
                  console.error(err);
                  return;
                }
              })
            res.status(200).send(csv);
        } catch (error) {
            console.log('error:', error.message);
            res.status(500).send(error.message);
        }
    });
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
