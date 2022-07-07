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
describe("testing 404 endpoint when given non existing URL", () => {
  test("should output 404 and a message when givien a invalid url", () => {
    return request(app)
      .get("/api/badURL")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Path !");
      });
  });
});

describe("testing app /api/topics", () => {
  describe("testing GET on /api/topics", () => {
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
          topics.forEach(topic => {
            expect.objectContaining(testTopicObj);
          });
          // expect(topics).toEqual(
          //   expect.arrayContaining([expect.objectContaining(testTopicObj)])
          // );
        });
    });
  });
});

describe("testing app /api/users", () => {
  describe("testing app GET /api/users", () => {
    const testUserObj = {
      username: expect.any(String),
      name: expect.any(String),
      avatar_url: expect.any(String),
    };
    test("should return an array of user object with correct properties and satus 200", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body;
          expect(body).toHaveLength(4);
          users.forEach(user => {
            expect.objectContaining(testUserObj)
          });
          // expect(users).toEqual(
          //   expect.arrayContaining([expect.objectContaining(testUserObj)])
          // );
        });
    });
  });
});

describe("testing app /api/articles", () => {
  describe("testing GET on /api/articles with no queries", () => {
    const testArticleObj = {
      article_id: expect.any(Number),
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      comment_count: expect.any(Number),
    };
    test("should return an array of article objects with correct properties, status 200 by default sorted by descending date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body;
          expect(articles).toHaveLength(12);
          expect(articles[0].created_at).toEqual("2020-11-03T09:12:00.000Z");
          articles.forEach(article => {
            expect.objectContaining(testArticleObj)
          });
          // expect(articles).toEqual(
          //   expect.arrayContaining([expect.objectContaining(testArticleObj)])
          // );
        });
    });
  });
  describe('testing GET on /api/articles with queries', () => {
    describe('Sort queries defaulted to desc', () => {
      test('should return an array of article objects with correct properties, status 200 and be sorted by title', () => {
        return request(app)
          .get('/api/articles?sort_by=title')
          .expect(200)
          .then(({ body}) => {
            const articles = body
            expect(articles[0].title).toEqual("Z")
          })
      });
      test('should return an array of article objects with correct properties, status 200 and be sorted by topic', () => {
        return request(app)
          .get('/api/articles?sort_by=topic')
          .expect(200)
          .then(({ body}) => {
            const articles = body
            expect(articles[0].topic).toEqual("mitch")
          })
      });
      test('should return an array of article objects with correct properties, status 200 and be sorted by author', () => {
        return request(app)
          .get('/api/articles?sort_by=author')
          .expect(200)
          .then(({ body}) => {
            const articles = body
            expect(articles[0].author).toEqual("rogersop")
          })
      });
      test('should return an array of article objects with correct properties, status 200 and be sorted by body', () => {
        const expectedBody = "some gifs"
        return request(app)
          .get('/api/articles?sort_by=body')
          .expect(200)
          .then(({ body}) => {
            const articles = body
            expect(articles[0].body).toEqual(expectedBody)
          })
      });
      test('should return an array of article objects with correct properties, status 200 and be sorted by date when specified', () => {
        return request(app)
          .get('/api/articles?sort_by=date')
          .expect(200)
          .then(({ body}) => {
            const articles = body
            expect(articles[0].created_at).toEqual("2020-11-03T09:12:00.000Z")
          })
      });
      test('should return an array of article objects with correct properties, status 200 and be sorted by votes', () => {
        return request(app)
          .get('/api/articles?sort_by=votes')
          .expect(200)
          .then(({ body}) => {
            const articles = body
            expect(articles[0].votes).toEqual(100)
          })
      });
      test('should return an array of article objects with correct properties, status 200 and be sorted by article_id', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id')
          .expect(200)
          .then(({ body}) => {
            const articles = body
            expect(articles[0].votes).toEqual(0)
          })
      });
    });
  });
});

describe("testing app /api/articles/:article_id/comments", () => {
  describe("testing GET on /api/articles/:article_id/comments", () => {
    const testCommentsObj = {
      comment_id: expect.any(Number),
      votes: expect.any(Number),
      created_at: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
    };
   
    test("should return an array of comments with correct properties", () => {
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(({ body }) => {
          const comments = body;
          expect(comments).toHaveLength(11);
          comments.forEach(comment => {
            expect.objectContaining(testCommentsObj)
          });
          // expect(comments).toEqual(
          //   expect.arrayContaining([expect.objectContaining(testCommentsObj)])
          // );
        });
    });
    
    test('should return an empty array if the article_id exists but has no comments', () => {
      const articleId = 4;
      return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then(({body}) => {
        const comments = body;
        expect(comments).toEqual([])
      })
    });
  });
  describe("test GET errors on /api/articles/:article_id/comments is given a badId", () => {
    const badId = "thisisabadId";
    test("should output 400 and a message stating the id is invalid for comments endpoint", () => {
      return request(app)
        .get(`/api/articles/${badId}/comments`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Your body or request has the wrong input type");
        });
    });
  });
  describe("test GET errors for when /api/articles/:article_id/comments is given a non existing id", () => {
    const nonExistingId = 99999999;
    test("should output a 404 and a message when given non=existent id for comments endpoint", () => {
      return request(app)
        .get(`/api/articles/${nonExistingId}/comments`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("This article id does not exist !");
        });
    });
  });
  describe("testing POST on /api/articles/:article_id/comments", () => {
    const testCommentsObj1 = {
      comment_id: expect.any(Number),
      votes: 0,
      created_at: expect.any(String),
      article_id: 1,
      author: "icellusedkars",
      body: "I am 100% sure",
    };
    const testBody1 = {
      username: "icellusedkars",
      body: "I am 100% sure",
    };
    const articleId = 1;
    test("should return a 201 and the new comment", () => {
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(testBody1)
        .expect(201)
        .then(({ body }) => {
          const comment = body;
          expect(body).toEqual({ comment: testCommentsObj1 });
        });
    });
  });
  describe('testing POST errors for malformed body on /api/articles/:article_id/comments', () => {
    const emptyBody = {};
    const malformedBody = {
      bad: 9999,
    }
    const articleId = 1;
    test('should output a 400 and a message stating the body is malformed/missing fields when given empty body', () => {
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(emptyBody)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("The body is missing fields or Malformed !");
        });
    });
    test('should output a 400 and a message stating the body is malformed/missing fields when given malformed body', () => {
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(malformedBody)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("The body is missing fields or Malformed !");
        });
    });
  });
  describe('testing POST errors on /api/articles/:article_id/comments when given a non existing id', () => {
    const nonExistingId = 24;
    const testBody1 = {
      username: "icellusedkars",
      body: "I am 100% sure",
    };
    test('should output a 404 and a message when given non=existent id for comments endpoint', () => {
      return request(app)
        .post(`/api/articles/${nonExistingId}/comments`)
        .send(testBody1)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("This article id does not exist !");
        });
    });
  });
  describe('testing POST errors on /api/articles/:article_id/comments when given a non existing user', () => {
    const testBody = {
      username: "idontexist!",
      body: "This Shouldn't work !",
    }
    const articleId = 1;
    test('should return a 404 and a message when given a non existent user', () => {
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(testBody)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("This user does not exist !");
        });
    });
  });
});

describe("testing /api/articles/:article_id", () => {
  describe("testing GET on /api/articles/:article_id", () => {
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
          expect(article).toEqual({
            article_id: 1,
            ...testArticleObj,
            comment_count: 11,
          });
        });
    });
  });
  describe("test GET errors on /api/articles/:article_id for incorrect input types ", () => {
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
  describe("test GET errors for non existing id on /api/articles/:article_id", () => {
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
  describe("testing PATCH on /api/articles/:article_id", () => {
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
  describe("test PATCH erros for malformed body on /api/articles/:article_id", () => {
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
});
