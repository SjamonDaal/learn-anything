#!/usr/bin/env node
const compression = require('compression');
const readFileSync = require('fs').readFileSync;
const express = require('express');
const dot = require('dot');
const api = require('./api/index');

const app = express();

// If on dev environment use hot reloading.
if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require */
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config');
  /* eslint-enable global-require */

  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    inline: true,
    stats: { color: true },
  }));

  app.use(webpackHotMiddleware(compiler));
}

// Compress files sent.
app.use(compression({ threshold: 0 }));

// Static files and api router.
app.use(express.static('client/public'));
app.use(express.static('client/dist'));
app.use('/api', api);


// Thumbnail by map title.
/* app.get(/thumbs\/(.*)/, (req, res) => {
  let filename = `${req.params[0]}.jpg`;

  if (filename !== 'learn-anything.jpg') {
    filename = `learn-anything/${filename}`;
  }

  res.sendFile(filename, { root: 'thumbs' });
}); */

// Templating engine for dynamic meta tags.
const render = dot.template(readFileSync(`${__dirname}/../client/index.html`));

app.get('*', (req, res) => {
  let title = req.originalUrl.replace(/\?.*/, '');
  if (title === '/') {
    // Render main page.
    res.send(render({
      title: 'Learn Anything',
      description: 'Search Interactive Mind Maps to learn anything',
      url: `${req.protocol}://${req.headers.host}${title}`,
      image: `${req.protocol}://${req.headers.host}/thumbs/learn-anything`,
    }));
  } else {
    // Render any other map.
    // Generate map name and topic of the map.
    title = title.slice(1).replace(/\/$/, '').replace(/\//g, '---');
    const splitTitle = title.split('---');
    const topic = splitTitle[splitTitle.length - 1].replace(/-/g, ' ').trim(' ');

    // TMP
    res.send(render({
      title: 'Learn Anything',
      description: 'Search Interactive Mind Maps to learn anything',
      url: `${req.protocol}://${req.headers.host}${title}`,
      image: `${req.protocol}://${req.headers.host}/thumbs/learn-anything`,
    }));

/*
    docClient.query({
      TableName: 'la-maps',
      KeyConditionExpression: '#title = :title',
      ExpressionAttributeNames: { '#title': 'title' },
      ExpressionAttributeValues: { ':title': title },
    }, (err, data) => {
      if (err) {
        res.status(500).send(JSON.stringify(err));
        return;
      }

      if (data.Items.length) {
        const result = data.Items[0];

        res.send(render({
          title: result.key || topic,
          description: result.description || `Learn ${result.key || topic} with hand curated mind maps.`,
          url: `${req.protocol}://${req.headers.host}${title}`,
          image: `${req.protocol}://${req.headers.host}/thumbs${title}`,
        }));
        return;
      }
      res.status(404).send(`Map ${title} not found.`);
    });
*/
  }
});

app.listen(3000, () => console.log('Server started.'));
