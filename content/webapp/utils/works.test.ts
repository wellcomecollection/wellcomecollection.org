import { showItemLink } from './works';
// TODO rewrite this function so we don't pass in allOriginalPdfs?
// test that the showItemLink function returns the correct value
describe('showItemLink', () => {
  it('should return false if userIsStaffWithRestricted is false and accessCondition is closed', () => {
    const result = showItemLink({
      userIsStaffWithRestricted: false,
      allOriginalPdfs: true,
      hasIIIFManifest: true,
      digitalLocation: { url: 'http://example.com' },
      accessCondition: 'closed',
      canvases: [],
      bornDigitalStatus: 'born-digital',
    });
    expect(result).toBe(false);
  });
  it('should return false if userIsStaffWithRestricted is false and accessCondition is closed', () => {
    const result = showItemLink({
      userIsStaffWithRestricted: false,
      allOriginalPdfs: true,
      hasIIIFManifest: true,
      digitalLocation: { url: 'http://example.com' },
      accessCondition: 'restricted',
      canvases: [],
      bornDigitalStatus: 'born-digital',
    });
    expect(result).toBe(false);
  });

  it('should return true if userIsStaffWithRestricted is true and accessCondition is closed and allOriginalPdfs is true', () => {
    const result = showItemLink({
      userIsStaffWithRestricted: true,
      allOriginalPdfs: true,
      hasIIIFManifest: true,
      digitalLocation: { url: 'http://example.com' },
      accessCondition: 'closed',
      canvases: [],
      bornDigitalStatus: 'born-digital',
    });
    expect(result).toBe(true);
  });
});
