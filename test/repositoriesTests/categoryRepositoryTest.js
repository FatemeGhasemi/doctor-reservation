const assert = require('assert');
const expect = require('chai').expect;
const categoryRepository = require('../../src/repositories/category')
describe('test findCategoryByParents', function () {
    it('should return some categories', async  () => {
        const categories = await categoryRepository.findCategoryByParents(null)
        expect(categories).to.be.an('array')
    });
    it('test findCategoryByParents with fake parent', async  ()=> {
        const categories = await categoryRepository.findCategoryByParents("fakeParent")
        expect(categories).to.have.length(0)
    });
});