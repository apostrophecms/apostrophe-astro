# Astro ApostropheCMS Integration

This module integrates ApostropheCMS into your Astro application.

The intent of this integration is to let Apostrophe manage page routing and content computation, and let Astro take the responsibility for rendering of pages and/or business logic, using your framework(s) of choice like React, Vue.js, Svelte, etc. (see the [Astro integrations page](https://docs.astro.build/en/guides/integrations-guide/)).  
  
**This module also brings the ApostropheCMS Admin UI in your Astro application**, so you can manage your site exactly as if you were in a "normal" Apostrophe instance.   

## Installation

Install this module in your **Astro application**, not your ApostropheCMS application:

```shell
npm i @apostrophecms/astro-integration
``` 
  
## Security

You must set the `APOS_EXTERNAL_FRONT_KEY` environment variable to a secret
value and set the same variable when starting up your Apostrophe application.

## Configuration

Since this is an Astro integration, you will need to add it to your Astro project's `astro.config.mjs` file:  

```js
import { defineConfig } from 'astro/config'
import apostrophe from '@apostrophecms/astro-integration'

export default defineConfig({
  ...
  integrations: [
    apostrophe({
        aposHost: 'http://localhost:3000',
        widgetsMapping: './src/widgets',
        templatesMapping: './src/templates',
        forwardHeaders: [
            'content-security-policy', 
            'strict-transport-security', 
            'x-frame-options',
            'referrer-policy',
            'cache-control'
        ]
    })
  ]
  ...
})

```

## Options

### `aposHost` (mandatory)  

This option is the base URL of your Apostrophe instance. It must contain the
port number if testing locally and/or communicating directly with another instance
on the same server in a small production deployment. This option can be overriden
at runtime with the `APOS_HOST` environment variable.   

### `widgetsMapping` (mandatory)  

The file in your project that contains the mapping between Apostrophe widget types and your Astro components (see below).   

### `templatesMapping` (mandatory)

The file in your project that contains the mapping between Apostrophe page types and your Astro templates (see below).

### `forwardHeaders`  

An array of HTTP headers that you want to forward from Apostrophe to the final response sent to the browser - useful if you want to use an Apostrophe module like `@apostrophecms/security-headers` and want to keep those headers as configured in Apostrophe.  
At the present time, Astro is not compatible with the `nonce` property of `content-security-policy` `script-src` value. So this is automatically removed with that integration. The rest of the CSP header remains unchanged.

## Getting started

This getting started guide assumes that you are aware of ApostropheCMS setup basics, and you have an Apostrophe instance running with the
`APOS_EXTERNAL_FRONT_KEY` environment variable set to a shared secret that you will also set when running Astro.

### Two projects: Astro and ApostropheCMS

After completing this guide, you will have *two* projects: an Astro project and an ApostropheCMS
project. You can think of ApostropheCMS as a CMS back end for Astro here, but with the on-page editing
UI fully available within Astro.

### Create your Astro templates mapping

Astro templates are the inner part of your pages that will be mapped to Apostrophe's page types.  
  
Create your template mapping in a file in your Astro application, for example in a `src/templates/index.js` file.   
This file path must then be added to your `astro.config.mjs` file, in the `templatesMapping` option of the `apostrophe` integration.   

```js
import HomePage from './HomePage.astro';
import CustomPage from './CustomPage.astro';

const docTypes = {
  '@apostrophe-cms/home-page': HomePage,
  'custom-page': CustomPage
};
export default docTypes;

```
Naming your templates is up to you. The above convention is just a suggestion.

The integration comes with three special page types that can be mapped to Astro templates:
- `apos-not-found`: page type served when Apostrophe returns a 404 page. The integration will set Astro's response status to 404.
- `apos-fetch-error`: page type served when Apostrophe generates a 500-class error. The integration will set Astro's response status to 500.
- `apos-no-template`: page type served when there is no mapping corresponding to the Apostrophe page type for this page.

See below for an example Astro template for the `@apostrophe-cms/home-page` type.

### Create your Astro widgets mapping
Similar to Astro apge templates, Astro widget templates replace Apostrophe's usual
widget rendering, allowing you to render widgets using any frontend framework
supported by Astro.

Create your template mapping in a file in your application, for example in a
`src/widgets/index.js` file. This file path must then be added to your `astro.config.mjs` file,
in the `widgetsMapping` option of the `apostrophe` integration.

```js
import ImageWidget from './ImageWidget.astro'
import CustomWidget from './CustomWidget.astro'

const docTypes = {
  '@apostrophe-cms/image': Image,
  'custom': CustomWidget
};
 export default docTypes;
```

> Note that basic widget types like `@apostrophecms/image` do need an Astro
template in your project. This integration does not currently ship with built-in
templates for common Apostrophe widgets. However, see the sample project
for these.

Note that the Apostrophe document type is the name of your widget module without the `-widget` part.
The naming of your Astro widget templates is up to you. The above convention is just
a suggestion.

### Create your [...slug].astro page and fetch Apostrophe data

Since Apostrophe is responsible for managing content, including creating new content and pages
on the fly, you will only need one top-level Astro page component: the `[...slug].astro` template.

The integration comes with an `aposPageFetch` method that can be used to automatically
fetch the relevant data for the current URL.

Your `[...slug].astro` component should look like this:

```js
---
import aposPageFetch from '@apostrophecms/astro-integration/lib/aposPageFetch';

const aposData = await aposPageFetch(Astro.request);
---

```
The `aposData` object will then contain all of the `req.data` object that you have in Apostrophe.  
Basically you will have as properties:  
- `page`: the page document for the current URL
- `global`: the `apos.global` object   

Any other data that your custom Apostrophe module would add to the `req.data` will also be available in that object.   

### Add the AstroLayout and AposTemplate to the page
This integration comes with a full managed global layout (outerLayout as called in Apostrophe).
In your `[...slug].astro` file, use the `AposLayout` component coming with this integration.   
It will come with those slots, very related to what we have in the Nunjucks blocks of Apostrophe: 
- `startHead`: slot in the very beginning of the `<head>`
- `standardHead`: slot in the middle of `<head>`, just after `<title>`  
- `extraHead`: still in the HTML `<head>`, at the very end
- `startBody`: at the very beginning of the `<body>` - this is not part of the refresh zone in edit mode
- `beforeMain`: at the very beginning of the main body zone - part of the refresh zone in edit mode
- `main`: the inner part of the main body zone - part of the refresh zone in edit mode
- `afterMain`: at the very end of the main body zone - part of the refresh zone in edit mode
- `endBody`: at the very end of the `<body>` - this is not part of the refresh zone in edit mode

This Layout component has 4 props: 
- `aposData`: the data fetched from Apostrophe
- `title`: this will go in the `<title>` HTML tag
- `lang` which will be set in the `<html>` `lang` attribute
- `bodyClass`: this will be added in the class attribute of the `<body>` element

This layout component will manage the switch between Edit Mode with Admin UI if the user is connected, or a Run Layout without wrappers and specific elements that are needed for the Admin UI.  
```js
---
import aposPageFetch from '@apostrophecms/astro-integration/lib/aposPageFetch'
import AposLayout from '@apostrophecms/astro-integration/components/layouts/AposLayout.astro'
import AposTemplate from '@apostrophecms/astro-integration/components/AposTemplate.astro'

const aposData = await aposPageFetch(Astro.request)
const bodyClass = `myclass`
--- 
<AposLayout title={aposData.page?.title} {aposData} {bodyClass}>
    <Fragment slot="standardHead">
      <meta name="description" content={aposData.page?.seoDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charset="UTF-8" />
    </Fragment>
    <AposTemplate {aposData} slot="main"/>
</AposLayout>

```
The `AposTemplate` Astro component will manage to find the right template based on your template mapping, using the page type.  
It takes one prop that is the full `aposData` object.  
You will have then this object in your template `Astro.props`.   

### Create your Astro template
Create your Astro file for your particular template, in which, if needed you will use the `<AposArea>` component to display your Apostrophe areas and then widgets.   
For example, for the `@apostrophe-cms/home-page` that has mainly one field that is the `main` area:   
```js
---
import AposArea from `@apostrophecms/astro-integration/components/AposArea.astro`
const { page } = Astro.props.aposData
const area = page.main
---
<AposArea {area}/>
```
You can add any other props the this `AposArea` component, it will be then passed down to each widget that needs to be displayed.  

### Create your Astro widgets
You Astro widget will receive a `widget` property, among any other custom props you passed to the `AposArea` component.  
This `widget` property contains the JSON representation of your Apostrophe widget.  
For example, the Astro widget for the `@apostrophecms/image` widget could be:  
```js
---
const { widget } = Astro.props

const src = widget._image[0].attachment._urls['full']
---
<img {src} />
```

## The login page
With that integration in place, you will be able to reach as usual the login page at the `/login` path.   
This login page is strictly the Apostrophe login page, proxified only by Astro.   
Any added components / feature like hCaptcha or TOTP will work strictly the same.   

## Reserved routes
As this integration proxifies some Apostrophe endpoints, there are some routes that are taken by those endpoints:   
- `/apos-frontend/[...slug]` for serving Apostrophe assets
- `/uploads/[...slug]` for serving Apostrophe uploaded assets
- `/api/v1/[...slug]` and `/[locale]/api/v1/[...slug]` for Apostrophe API endpoints
- `/login` and `/[locale]/login` for the login page

As all Apostrophe API endpoints are proxified, you can expose as usual new api routes in your Apostrophe modules, and be able to request them through your Astro application.   
Those proxies are forwarding all the original request headers such as cookies, so as you will be able to identify for example if the user making the request is connected or not in your Apostrophe endpoint, just again if you were in a "normal" Apostrophe implementation.   

## Redirections
When Apostrophe sends a response as a redirection, you will receive a specific simple `aposData` containing `redirect: true`, an `url` property for the url to redirect to, along with a `status` for the redirection HTTP status code.      
You will need to handle that response specifically in your `[...slug].astro` file:    
```js
const aposData = await aposPageFetch(Astro.request)
// Redirect
if (aposData.redirect) {
  return Astro.redirect(aposData.url, aposData.status)
}
```