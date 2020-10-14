var chai = require('chai');
var chaiHttp = require('chai-http');
const { v4: uuidv4 } = require('uuid')

var userid = uuidv4();
var postingid = uuidv4();
var username = uuidv4();
var password = uuidv4();

var host = 'http://ec2-54-145-72-123.compute-1.amazonaws.com'

chai.use(chaiHttp);

describe('Full test suite', function() {
    it('should find postings based on time || /postings?time=1577000000', function(done) {
        chai
            .request(host)
            .get('/postings')
            .query({ 
                time: '1577000000'
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.be.json;
                chai.expect(res).to.have.status(200);
                done();
            })
    })
    it('should NOT find postings based on time (no created postings that match query) || /postings?time=4577000000', function(done) {
        chai
            .request(host)
            .get('/postings')
            .query({ 
                time: '4577000000'
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(204);
                done();
            })
    })
    it('should find postings based on three parameters (time, category and location) || /postings?time=1577000000&location=Helsinki&category=Examples', function(done) {
        chai
            .request(host)
            .get('/postings')
            .query({ 
                time: '1577000000',
                location: 'Helsinki',
                category: 'Examples'
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.be.json;
                chai.expect(res).to.have.status(200);
                done();
            })
    })
    it('should fail to create posting (not logged in) || /postings', function(done) {
        chai
            .request(host)
            .post('/postings')
            .send({
                'id': userid,
                'postingid': postingid,
                'title': "Example Item",
                'description': "Example description",
                'category': "Examples",
                'location': "Helsinki, Finland",
                'images': [
                    "https://www.hopefullymadeupwebsite.com/images/463460325",
                    "https://www.hopefullymadeupwebsite.com/images/463460326",
                    "https://www.hopefullymadeupwebsite.com/images/463460327",
                    "https://www.hopefullymadeupwebsite.com/images/463460328"
                ],
                'price': "100.00",
                'dateofposting': "01/01/2020",
                'deliverytype': "shipping",
                'sellername': "John Doe",
                'sellerphone': "123-456-7890"
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);
                done();
            })
    })
    it('should fail to create user as expected (missing username) || /registeruser', function(done) {
        chai
            .request(host)
            .post('/registeruser')
            .send({
                'password': password
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);
                done();
            })
    })
    it('should create user... || /registeruser', function(done) {
        chai
            .request(host)
            .post('/registeruser')
            .send({
                'id': userid,
                'username': username,
                'password': password
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(201);
                done();
            })
    })
    it('should fail to login to created user (wrong password) || /login', function(done) {
        chai
            .request(host)
            .get('/login')
            .send({
                'username': username,
                'password': 'wrong'
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);
                done();
            })
    })
    it('should login to created user... || /login', function(done) {
        chai
            .request(host)
            .get('/login')
            .send({
                'username': username,
                'password': password
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                done();
            })
    })
    it('should create a new posting || /postings', function(done) {
        chai
            .request(host)
            .post('/postings')
            .send({
                'id': userid,
                'postingid': postingid,
                'title': "My Chai test item",
                'description': "My chai description",
                'category': "Examples",
                'location': "Oulu",
                'images': [
                    "https://www.hopefullymadeupwebsite.com/images/463460329",
                    "https://www.hopefullymadeupwebsite.com/images/463460330",
                    "https://www.hopefullymadeupwebsite.com/images/463460331"
                ],
                'price': "100.00",
                'deliverytype': "shipping",
                'sellername': "Chaiman",
                'sellerphone': "123-456-7891"
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(201);
                done();
            })
    })
    it('should modify posting made earlier || /postings/:id', function(done) {
        chai
            .request(host)
            .put('/postings/' + postingid)
            .send({
                'id': userid,
                'newTitle': 'My New Posting',
                'newDescription': 'My New Description',
                'newPrice': '50'
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                done();
            })
    })
    it('should fail to delete posting (posting created by someone else) || /postings/:id', function(done) {
        chai
            .request(host)
            .delete('/postings/1')
            .send({
                'id': userid
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);
                done();
            })
    })
    it('should fail to delete posting (such posting doesnt exist) || /postings/:id', function(done) {
        chai
            .request(host)
            .delete('/postings/0')
            .send({
                'id': userid
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);
                done();
            })
    })
    it('should delete the posting that was made earlier || /postings/:id', function(done) {
        chai
            .request(host)
            .delete('/postings/'+postingid)
            .send({
                'id': userid
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                done();
            })
    })
    it('should fail to delete the posting (as it was already deleted))|| /postings/:id', function(done) {
        chai
            .request(host)
            .delete('/postings/'+postingid)
            .send({
                'id': userid
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);
                done();
            })
    })
    it('should logout user || /logout', function(done) {
        chai
            .request(host)
            .get('/logout')
            .send({
                'id': userid
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                done();
            })
    })
    it('should fail to logout user (already logged out)|| /logout', function(done) {
        chai
            .request(host)
            .get('/logout')
            .send({
                'id': userid
            })
            .end(function (err, res) {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);
                done();
            })
    })
})