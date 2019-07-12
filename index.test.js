const {app} = require('./index');
const supertest = require('supertest');
const cookieSession = require('cookie-session');
// test('string that describes the test', () => {
//
//
// });
// app here refers to our express server:
test('GET /home returns an h1 as response', () => {
    return supertest(app).get('/home').then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Welcome");
    });
});

test('POST /product redirects to /home', () => {
    return supertest(app).post('/product').then(res => {
        expect(res.statusCode).toBe(302);
        // expect(res.text).toContain('Found');
        expect(res.headers.location).toBe('/home');
    });
});


        // expect(res.text).toBe("<h1>Welcome to my website</h1>")

// in terminal we run test from our curry-petition folder and run:
// npm test

// how to handle user input in a test:
// all the words that come before = sign are input fields names:

// test('POST /product redirects to /home', () => {
//     return supertest(app).post('/product').send('first=testFirstName&last=testLastName&email=test@test.test&password=myTestPassword').then(res => {
//         expect(res.statusCode).toBe(302);
//         expect(res.headers.location).toBe('/home');
//     });
// });

//testing cookies:
