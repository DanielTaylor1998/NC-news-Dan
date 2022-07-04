const seed = require("../db/seeds/seed");
const { topicData, articleData, userData, commentData} = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require('../index');

beforeEach(() => seed({ topicData, articleData, userData, commentData}));

afterAll(() => db.end());

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