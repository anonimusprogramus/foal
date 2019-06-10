import { strictEqual } from 'assert';
import { HttpResponse, HttpResponseOK } from '../core';
import {
  SESSION_DEFAULT_COOKIE_HTTP_ONLY, SESSION_DEFAULT_COOKIE_NAME, SESSION_DEFAULT_COOKIE_PATH
} from './constants';
import { Session } from './session';
import { setSessionCookie } from './set-session-cookie';

describe('setSessionCookie', () => {

  let session: Session;
  let response: HttpResponse;
  const maxAge = 3600;

  before(() => process.env.SETTINGS_SESSION_SECRET = 'secret');

  after(() => delete process.env.SETTINGS_SESSION_SECRET);

  beforeEach(() => {
    response = new HttpResponseOK();
    session = new Session('xxx', {}, maxAge);
  });

  describe('should set a session cookie in the response', () => {

    describe('given no configuration option is provided', () => {

      beforeEach(() => setSessionCookie(response, session));

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(value, session.getToken());
      });

      it('with the proper default "domain" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.domain, undefined);
      });

      it('with the proper default "httpOnly" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.httpOnly, SESSION_DEFAULT_COOKIE_HTTP_ONLY);
      });

      it('with the proper default "path" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.path, SESSION_DEFAULT_COOKIE_PATH);
      });

      it('with the proper default "sameSite" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.sameSite, undefined);
      });

      it('with the proper default "secure" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.secure, undefined);
      });

      it('with the proper "maxAge" directive.', () => {
        const { options } = response.getCookie(SESSION_DEFAULT_COOKIE_NAME);
        strictEqual(options.maxAge, maxAge);
      });

    });

    describe('given configuration options are provided', () => {

      beforeEach(() => {
        process.env.SETTINGS_SESSION_COOKIE_NAME = 'auth2';
        process.env.SETTINGS_SESSION_COOKIE_DOMAIN = 'example.com';
        process.env.SETTINGS_SESSION_COOKIE_HTTP_ONLY = 'false';
        process.env.SETTINGS_SESSION_COOKIE_PATH = '/foo';
        process.env.SETTINGS_SESSION_COOKIE_SAME_SITE = 'strict';
        process.env.SETTINGS_SESSION_COOKIE_SECURE = 'true';
        setSessionCookie(response, session);
      });

      afterEach(() => {
        delete process.env.SETTINGS_SESSION_COOKIE_NAME;
        delete process.env.SETTINGS_SESSION_COOKIE_DOMAIN;
        delete process.env.SETTINGS_SESSION_COOKIE_HTTP_ONLY;
        delete process.env.SETTINGS_SESSION_COOKIE_PATH;
        delete process.env.SETTINGS_SESSION_COOKIE_SAME_SITE;
        delete process.env.SETTINGS_SESSION_COOKIE_SECURE;
      });

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie('auth2');
        strictEqual(value, session.getToken());
      });

      it('with the proper default "domain" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.domain, 'example.com');
      });

      it('with the proper default "httpOnly" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.httpOnly, false);
      });

      it('with the proper default "path" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.path, '/foo');
      });

      it('with the proper default "sameSite" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.sameSite, 'strict');
      });

      it('with the proper default "secure" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.secure, true);
      });

      it('with the proper "maxAge" directive.', () => {
        const { options } = response.getCookie('auth2');
        strictEqual(options.maxAge, maxAge);
      });

    });

  });

});
