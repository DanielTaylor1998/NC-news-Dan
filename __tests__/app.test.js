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