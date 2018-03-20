/* eslint-env mocha, node */
'use strict';

const extractConfig = require('..').extractConfig;
const expect = require('chai').expect;

describe('extractOptions', function() {
  describe('top-level addon', function() {
    beforeEach(function() {
      process.env.EYEGLASS_DEPRECATE_ON_BROWSER_CONFIG = true;
    });

    afterEach(function() {
      delete process.env.EYEGLASS_DEPRECATE_ON_BROWSER_CONFIG;
    });

    it('no config', function() {
      const addon = {
        project: {
          config() {
            return { };
          }
        },
        parent: { }
      };

      const host = {
        options: { }
      };

      expect(extractConfig(host, addon)).to.deep.eql({});
    });

    it('build config', function() {
      const addon = {
        project: {
          config() {
            return { };
          }
        },
        parent: { }
      };

      const eyeglass = { OMG: true, nested: { INNER: true } };
      const host = {
        options: {
          eyeglass
        }
      };

      expect(extractConfig(host, addon), 'eyeglassConfig should be a deep clone').to.not.equal(eyeglass);
      expect(extractConfig(host, addon).nested, 'eyeglassConfig should be a deep clone').to.not.equal(eyeglass.nested);
      expect(extractConfig(host, addon)).to.deep.eql(eyeglass);
      expect(extractConfig(host, addon).nested, 'eyeglassConfig should be a deep clone').to.eql(eyeglass.nested);
    });

    it('config/environment', function() {
      const eyeglass = { OMG: true, nested: { INNER: true } };
      const addon = {
        project: {
          config() {
            return { eyeglass };
          }
        },
        parent: { }
      };

      const host = {
        options: { }
      };

      expect(() => extractConfig(host, addon)).to.throw(/is no longer supported/);
    });

    it('both config/environment and buildConfig', function() {
      const eyeglassENV = { OMG: true, nested: { INNER: true } };
      const eyeglassBUILD = { OMG: false, nested: { INNER: false } };

      const addon = {
        project: {
          config() {
            return { eyeglass: eyeglassENV };
          }
        },
        parent: { }
      };

      const host = {
        options: {
          eyeglass: eyeglassBUILD
        }
      };

      expect(() => extractConfig(host, addon)).to.throw(/is no longer supported/);
    });
  });
});
