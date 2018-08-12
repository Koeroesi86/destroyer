import React from 'react'
import PropTypes from 'prop-types'

function IndexPage (props) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#222222' />
        <meta name='msapplication-TileColor' content='#ffffff' />
        <title>{props.locals.title}</title>
      </head>
      <body>
        <div id='root' />
        <script src={props.locals.assets.client} />
      </body>
    </html>
  )
}

IndexPage.propTypes = {
  locals: PropTypes.shape({
    title: PropTypes.string,
    doctype: PropTypes.string,
    assets: PropTypes.shape({
      client: PropTypes.string
    })
  })
}

export default IndexPage
