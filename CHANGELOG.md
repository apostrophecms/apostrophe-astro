# Changelog

## UNRELEASED

### Adds

* Add support for automated bundles injection in Edit (apos) mode, required for supporting the new core "manifest" builds (when available).

## 1.0.9 (2024-10-23)

* Prevent the `Connection: Upgrade` header from breaking Astro's `fetch` calls to Apostrophe when hosted in an environment that permits websocket upgrades of existing connections.
* Refactored redundant code for building requests with the external front key, etc.

## 1.0.8 (2024-07-02)

* The `renderWidget` route will no longer crash if there was an issue getting the `render-widget` route from Apostrophe (like a mandatory field missing), it will respond with a 500 only, with a log message in the console. Thanks to Michelin for contributing this fix.

## 1.0.7 (2024-03-28)

* Visiting the `/login` page when already logged in no longer results in
an undesired direct response from Apostrophe. Redirects within api routes like the login issued
on the Apostrophe side are now sending a redirect response as per Astro endpoints documentation.
* Page refreshes no longer alternate between displaying the admin UI and not displaying it
with each refresh in certain configurations.
* Thanks to Michelin for collaborating on the solution.

## 1.0.6 (2024-03-26)

* Change the way we fetch from Apostrophe by using `undici` `request` method, so as all headers are correctly forwarded. As on latest Node.js versions, headers like `Host` are no more forwarded by the regular `fetch` global method.

## 1.0.5 (2024-02-07)

* Compatible with Astro's `ViewTransition` feature when editing, via
a workaround. Since this workaround imposes a performance penalty
(only for editors, not the public), the `viewTransitionWorkaround`
option must be set to `true` to enable it.

## 1.0.4 (2024-01-22)

* Documentation fixes only.

## 1.0.3 (2023-12-27)

* Documentation typo that impacts Linux and other case sensitive systems fixed.

## 1.0.2 (2023-12-22)

* Fix bug causing pages to crash after refresh if widget
grouping is used.

## 1.0.1 (2023-12-21)

* Fix bug impacting two-column widgets.

## 1.0.0 (2023-12-21)

* Initial release.
