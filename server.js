const express = require('express')
const app = express()
const PORT = 4000
const path = require('path')

app.use(express.static('public'))

// app.set('view engine', 'ejs')

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const elementsRouter = require('./routes/elements')
app.use('/elements', elementsRouter)

const genericRouter = require('./routes/generic')
app.use('/generic', genericRouter)

// This route will handle all the requests that are 
// not handled by any other route handler. In 
// this hanlder we will redirect the user to 
// an error page with NOT FOUND message and status
// code as 404 (HTTP status code for NOT found)
app.all('*', (req, res) => {
  res.status(404).send('<h1>404! Page not found</h1>');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})