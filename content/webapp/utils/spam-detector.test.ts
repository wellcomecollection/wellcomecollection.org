import { looksLikeSpam } from './spam-detector';

describe('requests that probably aren’t spam', () => {
  test.each([
    { query: undefined },
    { query: 'history of play' },
    // This is an example of real Chinese text in our catalogue
    // See https://wellcomecollection.org/works/grgcnqwf
    { query: '生殖健康问题 Reproductive health matters' },
  ])(`$query`, ({ query }) => {
    expect(looksLikeSpam(query)).toBeFalsy();
  });
});

describe('requests that probably are spam', () => {
  test.each([
    {
      query: '⏩ casino jackpot win win win ⏪'
    },
    {
      query:
        '不用认真来找我们免费玩赌场游戏sketchy.xyz我们拥有所有最好的骗局和垃圾邮件我们非常值得信赖您可以完全关闭病毒检查程序',
    },
    {
      query:
        '华体会官网登录入口手机-【copy url：spam123.abc】-金狮贵宾会官网登录中心-【copy url：spam123.abc】-8su'
    },
    {
      query:
        '\xE6\xBE\xB3\xE9\x97\xA8\xE8\xB6\xB3\xE7\x90\x83\xE5\x80\x8D\xE7\x8E\x87>>\xE5\xAE\x98\xE7\xBD\x9112345.com<<\xE6\xBE\xB3\xE9\x97\xA8\xE8\xB6\xB3\xE7\x90\x83\xE5\x8D\x9A\xE5\xBD\xA9\xE5\xAE\x98\xE6\x96\xB9\xE7\xBD\x91-\xE6\xBE\xB3\xE9\x97\xA8',
    },
  ])(`$query`, ({ query }) => {
    expect(looksLikeSpam(query)).toBeTruthy();
  });
});
