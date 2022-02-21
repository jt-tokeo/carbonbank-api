require('./connect');

let app =require('./api');
const port = 3024;

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});