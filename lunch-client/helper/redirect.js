export const redirect = (url, res) => {
    if (res) {
        res.redirect(302, url)
    } else {
        document.location.href = url
    }
}

