module.exports = {
    // requires access to window / document on client side (this is node yo)
    // downloadObjectAsJson(obj, name) {
    //     let dataStr =
    //         'data:text/json;charset=utf-8,' +
    //         encodeURIComponent(JSON.stringify(obj))
    //     const link = document.createElement('a')
    //     link.setAttribute('href', dataStr)
    //     link.setAttribute('download', name + '.json')
    //     link.body.appendChild(link) // required for firefox
    //     link.click()
    //     link.remove()
    // },
    buildHtml(obj, name) {
        var header = `Downloading ${name}`
        let fileName = `${name}.json`
        let href =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(obj))

        // concatenate header string
        // concatenate body string

        return `<!DOCTYPE html>
                <html>
                    <head>
                        <title>
                            ${header}
                        </title>
                    </head>
                    <body>
                        Download file: <a href=${href} download=${fileName}>${name}</a>
                    </body>
                </html>`
    },
}
