import Router from 'next/router'

export const redirect = (url, res) => {
    if (res) {
        res.redirect(302, url)
    } else {
        Router.push(url)
    }
}
