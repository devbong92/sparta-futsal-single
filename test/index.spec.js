import UsersService from '../src/services/users.service.js';

const usersService = new UsersService();

jest.mock('../src/services/users.service');
usersService.signUp.mockReturnValue({ message: '회원가입이 완료되었습니다.' });

/** 테스트 : 회원가입 */
describe('회원가입 Service', () => {
  test('회원가입 성공', () => {
    const req = {
      email: 'jjangu1bark@email.com',
      password: '1234qwer',
      passwordCheck: '1234qwer',
      nickname: '슈퍼맨짱구',
    };

    const result = usersService.signUp(req.email, req.password, req.nickname);
    expect(result.message).toBe('회원가입이 완료되었습니다.');
  });
});
