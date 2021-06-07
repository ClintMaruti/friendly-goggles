// Endpoint testing with mocha and chai and chai-http

/**
 *
 * Module dependencies
 *
 */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

// Import Server
let server = require("../server");

// Import booksdb
let booksDb = require("../booksdb");
const { response } = require("express");

// Use ChaiHTTP for making the actual HTTP requests
chai.use(chaiHttp);
let token;
let book = {
  author: "Barry Smith",
  country: "London",
  language: "English",
  pages: 189,
  title: "God's Kingdom Uprising",
  year: 2021,
};

describe("Testing Book API", () => {
  beforeEach((done) => {
    chai
      .request(server)
      .post("/login")
      .send({
        username: "john",
        password: "password123admin",
      })
      .end((err, res) => {
        token = res.body.accessToken;
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("accessToken");
        res.body.should.have.property("refreshTokens");
        done();
      });
  });

  describe("Get all books", () => {
    it("Should get all books for user", (done) => {
      chai
        .request(server)
        .get("/books")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");
          res.body[0].should.have.property("author");
          res.body[0].should.have.property("country");
          res.body[0].should.have.property("language");
          res.body[0].should.have.property("pages");
          res.body[0].should.have.property("title");
          res.body[0].should.have.property("year");
          done();
        });
    });
  });

  describe("Post a book", () => {
    it("Should add a books to the database", (done) => {
      chai
        .request(server)
        .post("/books")
        .set({ Authorization: `Bearer ${token}` })
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.equal("Book added successfully");
          done();
        });
    });
  });
});
