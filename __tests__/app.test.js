const seed = require("../db/seeds/seed");
const { topicData, articleData, userData, commentData} = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require('../index');

beforeEach(() => seed({ topicData, articleData, userData, commentData}));

afterAll(() => db.end());

describe('testing 404 endpoint', () => {
    test('should output 404 and a message when givien a invalid url', () => {
        return request(app)
        .get("/api/badURL")
        .expect(404)
        .then(({ body: { msg }}) => {
            expect(msg).toBe("Invalid Path !")
        })
    });
});

describe('testing app GET /api/topics', () => {
    const testTopicObj = {
        description: expect.any(String),
        slug: expect.any(String),
    } 
    test('should return an array of topic objects with correct properties and status 200', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            const topic  = body;
            expect(topic).toHaveLength(3);
            expect(topic).toEqual(
                expect.arrayContaining([expect.objectContaining(testTopicObj)])
            )
        })
    });
});

describe('testing for non exist resources', () => {
    const nonExistingId = 99999999
    test('should output a 404 and a message when given non=existent id', () => {
        return request(app)
        .get(`/api/articles/${nonExistingId}`)
        .expect(404)
        .then(({ body : { msg }}) => {
            expect(msg).toBe("This article id does not exist !")
        })
    });
});

describe('test for bad Ids', () => {
    const badId = 'thisisabadId'
    test('should output 400 and a message stating the id is invalid', () => {
        return request(app)
        .get(`/api/articles/${badId}`)
        .expect(400)
        .then(({ body : { msg }}) => {
            expect(msg).toBe("invalid ID !")
        })
    });
});

describe('testing app GET /api/articles/:article_id', () => {
    const testArticleObj = {
        title : expect.any(String),
        topic : expect.any(String),
        author : expect.any(String),
        body : expect.any(String),
        created_at : expect.any(String),
        votes : expect.any(Number)
    }
    const articleId = 1;
    test('should return an article object (1) with correct properties and status 200', () => {
        return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then(({ body }) => {
            const article = body;
            expect(article).toEqual({article_id : 1, ...testArticleObj});
        })
    });
});

describe('testing PATCH /api/articles/:article_id', () => {
    const testArticleObj1 = {
        article_id : 1,
        title : expect.any(String),
        topic : expect.any(String),
        author : expect.any(String),
        body : expect.any(String),
        created_at : expect.any(String),
        votes : 101
    }
    const testBody1 = {
        inc_votes : 1
    }
    const articleId = 1;
    test('should return a 200 and the updated article with postive increase', () => {
        return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(testBody1)
        .expect(200)
        .then(({ body }) => {
            const article = body
            expect(article).toEqual({ article : testArticleObj1})
        })
    });
    const testArticleObj2 = {
        article_id : 1,
        title : expect.any(String),
        topic : expect.any(String),
        author : expect.any(String),
        body : expect.any(String),
        created_at : expect.any(String),
        votes : 99
    }
    const testBody2 = {
        inc_votes : -1
    }
    test('should return a 200 and the updated article with negative increase', () => {
        return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(testBody2)
        .expect(200)
        .then(({ body }) => {
            const article = body
            expect(article).toEqual({ article : testArticleObj2})
        })
    });
});