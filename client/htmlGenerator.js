import { renderToString } from 'react-dom/server'
import React from 'react'
import Index from '../components/index-page/Index'
import LoadingSplash from '../components/loading-splash/LoadingSplash'

export default function htmlGenerator (locals) {
  if (locals.path === '/loading.html') {
    return locals.doctype + renderToString(<LoadingSplash locals={locals} />)
  }

  return locals.doctype + renderToString(<Index locals={locals} />)
};
