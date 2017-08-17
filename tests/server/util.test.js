const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');
const util = require('../../server/util');

describe('server/util', () => {

  describe('#respond', () => {

    function Stub() {
      this.status = 0;
      this.head = '';
      this.content = '';
      this.writeHead = (status, head) => {
        this.status = status;
        this.head = head;
      };
      this.write = content => this.content += content;
      this.end = () => {};
    }

    let response;

    beforeEach(() => {
      response = new Stub();
    });

    it('should create 200 response', () => {

      const content = 'test';
      const head = {
        'Content-Length': 4,
        'Content-Type': 'text/plain'
      };

      util.respond(response, 200, {content, head});
      expect(response.status).to.equal(200);
      expect(response.head).to.deep.include(head);
      expect(response.content).to.equal(content);

    });

    it('should create 404 response', () => {

      util.respond(response, 404);
      expect(response.status).to.equal(404);

    });

    it('should create a JSON response', () => {

      const json = {hello: 'world'};
      util.respond(response, 200, {json});
      expect(response.status).to.equal(200);
      expect(response.head).to.include({'Content-Type': 'application/json'});
      expect(response.content).to.equal(JSON.stringify(json));

    });

  });

});