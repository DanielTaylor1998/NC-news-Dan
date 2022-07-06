const seed = require("../db/seeds/seed");
const {
  topicData,
  articleData,
  userData,
  commentData,
} = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../index");

beforeEach(() => seed({ topicData, articleData, userData, commentData }));

afterAll(() => db.end());

describe("testing 404 endpoint", () => {
  test("should output 404 and a message when givien a invalid url", () => {
    return request(app)
      .get("/api/badURL")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Path !");
      });
  });
});

describe("testing app GET /api/topics", () => {
  const testTopicObj = {
    description: expect.any(String),
    slug: expect.any(String),
  };
  test("should return an array of topic objects with correct properties and status 200", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body;
        expect(topics).toHaveLength(3);
        expect(topics).toEqual(
          expect.arrayContaining([expect.objectContaining(testTopicObj)])
        );
      });
  });
});

describe('testing app GET /api/users', () => {
    const testUserObj = {
        username: expect.any(String),
        name: expect.any(String),
        avatar_url : expect.any(String)
    }
    test('should return an array of user object with correct properties and satus 200', () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            const users = body;
            expect(body).toHaveLength(4);
            expect(users).toEqual(
                expect.arrayContaining([expect.objectContaining(testUserObj)])
            )
        })
    });
});

describe('testing app GET /api/articles', () => {
    const testArticleObj = {
        article_id : expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number)
      };
      test('should return an array of article objects with correct properties, status 200 by default sorted by descending date', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            const articles = body;
            expect(articles).toHaveLength(12)
            expect(articles[0].created_at).toEqual("2020-11-03T09:12:00.000Z")
            expect(articles).toEqual(
                expect.arrayContaining([expect.objectContaining(testArticleObj)])
            )
        })
      });
});

describe("testing for non exist resources", () => {
  const nonExistingId = 99999999;
  test("should output a 404 and a message when given non=existent id", () => {
    return request(app)
      .get(`/api/articles/${nonExistingId}`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("This article id does not exist !");
      });
  });
});

describe("tests for incorrect types", () => {
  const badId = "thisisabadId";
  test("should output 400 and a message stating the id is invalid", () => {
    return request(app)
      .get(`/api/articles/${badId}`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Your body or request has the wrong input type");
      });
  });
  const badTypeBody = {
    inc_votes: "NotType",
  };
  test("should output a 400 and a message stating the body is of wrong type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(badTypeBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Your body or request has the wrong input type");
      });
  });
});

describe("tests for malformed body", () => {
  const emptyBody = {};
  test("should output a 400 and a message stating the body is malformed/missing fields when given empty body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(emptyBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("The body is missing fields or Malformed !");
      });
  });
  const malformedBody = {
    bad: 9999,
  };
  test("should output a 400 and a message stating the body is malformed/missing fields when given malformed body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(malformedBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("The body is missing fields or Malformed !");
      });
  });
});

describe("testing app GET /api/articles/:article_id", () => {
  const testArticleObj = {
    title: expect.any(String),
    topic: expect.any(String),
    author: expect.any(String),
    body: expect.any(String),
    created_at: expect.any(String),
    votes: expect.any(Number),
  };
  const articleId = 1;
  test("should return an article object (1) with correct properties and status 200", () => {
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        const article = body;
        expect(article).toEqual({ article_id: 1, ...testArticleObj, comment_count : 11 });
      });
  });
});

describe("testing PATCH /api/articles/:article_id", () => {
  const testArticleObj1 = {
    article_id: 1,
    title: expect.any(String),
    topic: expect.any(String),
    author: expect.any(String),
    body: expect.any(String),
    created_at: expect.any(String),
    votes: 101,
  };
  const testBody1 = {
    inc_votes: 1,
  };
  const articleId = 1;
  test("should return a 200 and the updated article with postive increase", () => {
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(testBody1)
      .expect(200)
      .then(({ body }) => {
        const article = body;
        expect(article).toEqual({ article: testArticleObj1 });
      });
  });
  const testArticleObj2 = {
    article_id: 1,
    title: expect.any(String),
    topic: expect.any(String),
    author: expect.any(String),
    body: expect.any(String),
    created_at: expect.any(String),
    votes: 99,
  };
  const testBody2 = {
    inc_votes: -1,
  };
  test("should return a 200 and the updated article with negative increase", () => {
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(testBody2)
      .expect(200)
      .then(({ body }) => {
        const article = body;
        expect(article).toEqual({ article: testArticleObj2 });
      });
  });
});


