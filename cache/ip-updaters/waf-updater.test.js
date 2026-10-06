const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { validateIPChange, extractIpv4Addresses } = require('./waf-updater');

describe('validateIPChange', () => {
  it('allows initial population when current list is empty', () => {
    assert.doesNotThrow(() =>
      validateIPChange([], ['1.2.3.0/24', '4.5.6.0/24'])
    );
  });

  it('allows changes within 10%', () => {
    const current = Array.from({ length: 100 }, (_, i) => `10.0.${i}.0/24`);
    const newIPs = [...current, '10.1.0.0/24'];

    assert.doesNotThrow(() => validateIPChange(current, newIPs));
  });

  it('throws when changes exceed 10%', () => {
    const current = Array.from({ length: 10 }, (_, i) => `10.0.${i}.0/24`);
    // Remove 2 and add 2 different = 4 changed out of 10 = 40%
    const newIPs = [...current.slice(2), '192.168.0.0/24', '192.168.1.0/24'];

    assert.throws(() => validateIPChange(current, newIPs), {
      message: /exceeds maximum allowed/,
    });
  });

  it('detects swaps even when total count stays the same', () => {
    const current = Array.from({ length: 10 }, (_, i) => `10.0.${i}.0/24`);
    const newIPs = [
      ...current.slice(5),
      '192.168.0.0/24',
      '192.168.1.0/24',
      '192.168.2.0/24',
      '192.168.3.0/24',
      '192.168.4.0/24',
    ];

    assert.equal(current.length, newIPs.length, 'counts should be equal');
    assert.throws(() => validateIPChange(current, newIPs), {
      message: /exceeds maximum allowed/,
    });
  });

  it('allows prefixes being merged into a covering range', () => {
    const current = Array.from({ length: 16 }, (_, i) => `10.0.${i}.0/24`);
    // 16 entries become 1, same addresses
    assert.doesNotThrow(() => validateIPChange(current, ['10.0.0.0/20']));
  });

  it('throws when one new entry adds a large range', () => {
    const current = Array.from({ length: 100 }, (_, i) => `10.0.${i}.0/24`);
    // 1 entry in 100, but more addresses than the whole current list
    assert.throws(
      () => validateIPChange(current, [...current, '172.16.0.0/12']),
      {
        message: /exceeds maximum allowed/,
      }
    );
  });

  it('counts overlapping entries once', () => {
    const current = ['10.0.0.0/16', '10.0.1.0/24'];
    assert.doesNotThrow(() => validateIPChange(current, ['10.0.0.0/16']));
  });

  for (const [name, entry] of [
    ['junk text', 'not-an-ip'],
    ['an IPv6 range', '2001:db8::/32'],
    ['an empty string', ''],
    ['an out-of-range octet', '999.1.0.0/24'],
    ['a missing octet', '10.1.0/24'],
    ['an out-of-range prefix', '10.1.0.0/33'],
  ]) {
    it(`throws when the new list contains ${name}`, () => {
      const current = Array.from({ length: 100 }, (_, i) => `10.0.${i}.0/24`);
      assert.throws(() => validateIPChange(current, [...current, entry]), {
        message: /Invalid IPv4 CIDR/,
      });
    });
  }

  it('accepts a bare address as a /32', () => {
    const current = Array.from({ length: 100 }, (_, i) => `10.0.${i}.0/24`);
    assert.doesNotThrow(() =>
      validateIPChange(current, [...current, '10.1.0.1'])
    );
  });

  it('allows identical lists', () => {
    const ips = ['10.0.0.0/24', '10.0.1.0/24'];
    assert.doesNotThrow(() => validateIPChange(ips, [...ips]));
  });

  it('allows exactly 10% change', () => {
    const current = Array.from({ length: 100 }, (_, i) => `10.0.${i}.0/24`);
    // Add 10 new IPs = 10 changed out of 100 = exactly 10%
    const newIPs = [
      ...current,
      ...Array.from({ length: 10 }, (_, i) => `192.168.${i}.0/24`),
    ];

    assert.doesNotThrow(() => validateIPChange(current, newIPs));
  });

  it('throws just over 10% change', () => {
    const current = Array.from({ length: 100 }, (_, i) => `10.0.${i}.0/24`);
    // Add 11 new IPs = 11 changed out of 100 = 11%
    const newIPs = [
      ...current,
      ...Array.from({ length: 11 }, (_, i) => `192.168.${i}.0/24`),
    ];

    assert.throws(() => validateIPChange(current, newIPs), {
      message: /exceeds maximum allowed/,
    });
  });
});

describe('extractIpv4Addresses', () => {
  it('extracts IPv4 prefixes', () => {
    const data = {
      prefixes: [
        { ipv4Prefix: '66.249.64.0/19' },
        { ipv4Prefix: '66.249.96.0/20' },
      ],
    };

    assert.deepEqual(extractIpv4Addresses(data), [
      '66.249.64.0/19',
      '66.249.96.0/20',
    ]);
  });

  it('skips IPv6 prefixes', () => {
    const data = {
      prefixes: [
        { ipv4Prefix: '66.249.64.0/19' },
        { ipv6Prefix: '2001:4860:4801:10::/64' },
      ],
    };

    assert.deepEqual(extractIpv4Addresses(data), ['66.249.64.0/19']);
  });

  it('returns empty array for unexpected JSON structure', () => {
    assert.deepEqual(extractIpv4Addresses({}), []);
    assert.deepEqual(extractIpv4Addresses({ prefixes: 'not-an-array' }), []);
  });

  it('returns empty array when all entries are IPv6', () => {
    const data = {
      prefixes: [
        { ipv6Prefix: '2001:4860:4801:10::/64' },
        { ipv6Prefix: '2001:4860:4801:20::/64' },
      ],
    };

    assert.deepEqual(extractIpv4Addresses(data), []);
  });

  it('handles empty prefixes array', () => {
    assert.deepEqual(extractIpv4Addresses({ prefixes: [] }), []);
  });
});
