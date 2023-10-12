# Astro Apostrophe Integration

This module adds an Apostrophe integration to Astro.   
The Apostrophe instance that will be linked to the Astro application must use the `@michelin-cxf/apostrophe-headless` module for this integration to work.   
The intent of this integration is to let Apostrophe manage page routing and content computation as it does, and let Astro take the responsibility of the rendering of pages and/or business logic, using the framework(s) of choice like React, Vue.js, Svelte or so (see [Astro integrations page](https://docs.astro.build/en/guides/integrations-guide/)).  
  
**It brings also the Apostrophe Admin UI in your Astro application**, so as you can manage your site juste like if you were in a "normal" Apostrophe instance.   

## Usage
Install first this module in your Astro application: 
```shell
npm i @michelin-cxf/astro-apostrophe-integration
``` 
  
### Configuration
As an Astro integration, you will need to add it to your `astro.config.mjs` file:  

```js
import { defineConfig } from 'astro/config'
import apostrophe from '@michelin-cxf/astro-apostrophe-integration'

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
**Options**  
`aposHost` (mandatory)  
This option is the host of your Apostrophe instance configured as headless - must contain the protocol and eventually the port of your instance.  
This option can be overriden at runtime with the `APOS_HOST` environment variable.   
`widgetsMapping` (mandatory)  
The file in your project that contains the mapping between Apostrophe wdget types and your Astro components (see below).   
`templatesMapping` (mandatory)  
The file in your project that contains the mapping between Apostrophe page types and your Astro templates (see below).   
`forwardHeaders`  
An array of HTTP headers that you want to forward from Apostrophe to the final response sent to the browser - useful if you want to use an Apostrophe module like `@apostrophecms/security-headers` and want to keep those headers as configured in Apostrophe.  
At the time being, Astro is not compatible with the `nonce` property of `content-security-policy` `script-src` value. So this is automatically removed with that integration. Rest of the CSP header remains unchanged.
  
## Getting started
This getting started guide suppose that you are aware of Apostrophe setup, and you have an Apostrophe instance running with `@michelin-cxf/apostrophe-headless` module.   
  
### Create your Astro templates mapping
Astro templates are the inner part of your pages that will be mapped to Apostrophe's page types.  
  
Create your template mapping in a file in your application, for example in `src/templates/index.js` file.   
This file path is to be added then in your Astro config file, in the `templatesMapping` option of the `apostrophe` integration.   

```js
import HomePage from './HomePage.astro'
import CustomPage from './CustomPage.astro'

const doctypes = {
    '@apostrophe-cms/home-page': HomePage,
    'custom-page': CustomPage
}
 export defaut doctypes
```
The naming of your Astro template belongs to you, there is no rule.   
An example of template for the  `@apostrophe-cms/home-page` would be, as it has only one area called `main` in its schema:   
```js
---
const { aposData } = Astro.props
---
<AposArea area={aposData.page?.main}/>
```

### Create your Astro widgets mapping
Astro widgets are the rendering part of your Apostrophe widgets.   

Create your template mapping in a file in your application, for example in `src/widgets/index.js` file.   
This file path is to be added then in your Astro config file, in the `widgetsMapping` option of the `apostrophe` integration.  

```js
import ImageWidget from './ImageWidget.astro'
import CustomWidget from './CustomWidget.astro'

const doctypes = {
    '@apostrophe-cms/image': Image,
    'custom': CustomWidget
}
 export defaut doctypes
```
Note that the Apostrophe `doctype` is the name of your widget module without the `-widget`.  
The naming of your Astro widgets belongs to you, there is no rule.  

### Create your [...slug].astro page and fetch Apostrophe data
As this integration is made so as Apostrophe manage fully the content of your pages, whatever the path, the only Astro page component you need is the `[...slug].astro` page.   
The integration comes with an `aposPageFetch` method that will manage for you getting all the data for the current URL.   
```js
---
import aposPageFetch from '@michelin-cxf/astro-apostrophe-integration/lib/aposPageFetch'

const aposData = await aposPageFetch(Astro.request)
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
- `extrahead`: still in the HTML `<head>`, at the very end
- `beforeMain`: at the very beginning of the `<body>`
- `main`: the inner part of the `<body>`
- `afterMain`: at the very end of `<body>`  

This Layout component has 4 props: 
- `aposData`: the data fetched from Apostrophe
- `title`: this will go in the `<title>` HTML tag
- `lang` which will be set in the `<html>` `lang` attribute
- `bodyClass`: this will be added in the class attribute of the `<body>` element

This layout component will manage the switch between Edit Mode with Admin UI if the user is connected, or a Run Layout without wrappers and specific elements that are needed for the Admin UI.  
```js
---
import aposPageFetch from '@michelin-cxf/astro-apostrophe-integration/lib/aposPageFetch'
import AposLayout from '@michelin-cxf/astro-apostrophe-integration/components/layouts/AposLayout.astro'
import AposTemplate from '@michelin-cxf/astro-apostrophe-integration/components/AposTemplate.astro'

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
Create your Astro file for your particular template, in which, if needed you will us the `<AposArea>` component to display your Apostrophe areas and then widgets.   
For example, for the `@apostrophe-cms/home-page` that has mainly one field that is the `main` area:   
```js
---
import AposArea from `@micheoin-cxf/astro-apostrophe-integration/components/AposArea.astro`
const { page } = Astro.props.aposData
const area = page.main
---
<AposArea {area}/>
```
You can add any other props the this `AposArea` component, it will be then passed down to each widgets that needs to be displayed.  

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
- `/api/v1/[...slug]` and `/[locale]/api/v1/[...slug]` for Apostrophe API endpoints
- `/login` and `/[locale]/login` for the login page

As all Apostrophe API endpoints are proxified, you can expose as usual new api routes in your Apostrophe modules, and be able to request them through your Astro application.   
Those proxies are forwarding all the original request headers such as cookies, so as you will be able to identify for example if the user making the request is connected or not in your Apostrophe endpoint, just again if you were in a "normal" Apostrophe implementation.   