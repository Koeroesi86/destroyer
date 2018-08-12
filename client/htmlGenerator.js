import { renderToString } from 'react-dom/server'
import React from 'react'
import Index from '../components/index-page/Index'

export default function htmlGenerator (locals) {
  return locals.doctype + renderToString(<Index locals={locals} />)
};
