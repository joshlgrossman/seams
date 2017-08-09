Seams is a minimal, markup-driven, static-site CMS.

Installation
===

`npm i seams`

Seams persists content using MongoDB.  A `mongodb://` URI is required.

Usage
===

Seams is markup-driven, meaning that the user can create standard, valid HTML pages using specific data attributes that will later be injected with dynamic content when served.  For example:

```html
<html>
  <body>
    <h1 data-content="header">This is the default header</h1>
  </body>
</html>
```

Tells Seams to inject the `header` content for the current page into this `h1` tag.  If no such content exists, the `h1` will default to the `This is the default header` text.

Unlike most content management systems, Seams has no backend other than a single admin login page.  All content editing is done directly on the pages one wishes to edit.

Starting a Seams server is as easy as:

```js
const http = require('http');
const path = require('path');
const seams = require('seams');

const server = http.createServer(
  seams({
    secret: 'my secret key',
    dir: path.join(__dirname, 'web'),
    db: 'mongodb://my:mongo@database'
  })
);

server.listen(8080);
```

This will serve static content from the `web/` directory while injecting dynamic content wherever a Seams data attribute is found.  Valid Seams attributes are:

* `data-content` - Renders the `innerHTML` of the element it is found on.
* `data-src` - Sets the `src` attribute of the element it is found on (useful for `img` tags).
* `data-href` - Sets the `href` attribute of the element it is found on (useful for `a` tags).
* `data-text` - Sets the `innerText` of the element it is found on.

Getting started
===

After creating a directory with static HTML/CSS/JS files and acquiring a MongoDB URI, create a `server.js` file as shown above.  The `seams` function takes in an options object and returns a HTTP request/response handler function.  The options object can have the following properties:

```
{
  db: <string>,
  dir: <string>,
  secret: <string>,
  [expires: <number>]
}
```
Where `db` is the URI for the MongoDB, `dir` is the path to the directory containing the static files to be served, `secret` is the secret key used for hashing admin webtokens, and `expires` is an optional number to change the time (in milliseconds) until cached pages expire.  The default cache expiration time is 5 minutes.

Creating an admin
===

Initially running the server with the flags `--seams-admin-name` and `--seams-admin-password` will create an admin account. For example:

`node server.js --seams-admin-name=MyAdmin --seams-admin-password=password123`

Editing content
===

Once the server is running, navigate to `/seams` and log in with the credentials created from the command line.  Once logged in, navigate to the page to edit, click on a content area (a bubble will appear around the cursor when hovering over an editable content area) and edit it with the panel that appears.  Saving these changes will persist it to the database and the page will then render with the new content.

Elements given the `data-content` attribute are editable with basic markdown syntax:

* \#This is an h1\#
* \#\#This is an h2\#
* \_This is italicized\_
* \*This is bold\*
* \[This is a link to\]\(http://www.google.com)
* \!\[This is alt text\]\(for-some-image.jpg)