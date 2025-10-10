export default async function aposRenderArea({ Astro, AstroContainer, AposWidget }) {
  if (!(Astro && AstroContainer && AposWidget)) {
    usage();
  }
  if (Astro.request.method !== 'POST') {
    throw new Error('POST with JSON data expected');
  }
  if (Astro.request.headers.get('apos-external-front-key') !== process.env.APOS_EXTERNAL_FRONT_KEY) {
    throw new Error('apos-external-front-key header missing or incorrect');
  }
  const data = await Astro.request.json();
  const area = data.area;
  const widgetOptions = getWidgetOptions(area.options);

  const container = await AstroContainer.create();

  for (const item of area.items) {
    const options = {
      ...item._options,
      ...widgetOptions[item.type]
    };
    const { _options, ...cleanItem } = item;
    item._rendered = await container.renderToString(AposWidget, {
      props: {
        widget: cleanItem,
        options,
        ...Astro.props
      }
    });
  }
  return new Response(JSON.stringify({ area }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function usage() {
  throw new Error('Pass { Astro, AstroContainer, AposWidget } to this function');  
}

function getWidgetOptions(options) {
  let widgets = options.widgets || {};

  if (options.groups) {
    for (const group of Object.keys(options.groups)) {
      widgets = {
        ...widgets,
        ...options.groups[group].widgets
      };
    }
  }
  return widgets;
}
