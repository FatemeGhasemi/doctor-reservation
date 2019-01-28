// require('dotenv').config();
// const assert = require('assert');
// const expect = require('chai').expect;
//
// const userRepository = require('../../src/repositories/user')
// describe('createUserTest()', function () {
//     const phoneNumber ='091987310932'
//     it('createUserTest(), should create user repository successfully', async  () => {
//         const user  = await userRepository.createUser(phoneNumber)
//         assert.equal(user.phoneNumber, phoneNumber)
//     });
// });
// describe('findUserByPhoneNumberTest()', function () {
//     const phoneNumber ='091987310931'
//     const fakePhoneNumber ='09837120333'
//
//     it('should create user and find it by phone number', async  ()=> {
//         await userRepository.createUser(phoneNumber)
//         const user  = await userRepository.findUserByPhoneNumber(phoneNumber)
//         assert.equal(user.phoneNumber, phoneNumber)
//     });
//     it(' fail scenario, should find user by wrong phone number', async  ()=> {
//         await userRepository.createUser(phoneNumber)
//         const user  = await userRepository.findUserByPhoneNumber(fakePhoneNumber)
//         assert.equal(user)
//     });
// });