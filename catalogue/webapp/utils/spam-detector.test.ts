import { looksLikeSpam } from './spam-detector';

describe('requests that probably aren’t spam', () => {
  test.each([
    { query: 'history of play' },
    { query: '生殖健康问题 Reproductive health matters' },
  ])(`$query`, ({ query }) => {
    expect(looksLikeSpam(query)).toBeFalsy();
  });
});

describe('requests that probably are spam', () => {
  test.each([
    {
      query:
        '不用认真来找我们免费玩赌场游戏sketchy.xyz我们拥有所有最好的骗局和垃圾邮件我们非常值得信赖您可以完全关闭病毒检查程序',
    },
  ])(`$query`, ({ query }) => {
    expect(looksLikeSpam(query)).toBeTruthy();
  });
});
