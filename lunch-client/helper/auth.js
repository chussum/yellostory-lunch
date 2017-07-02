/*
export const auth = async (req, res) => {
    let token = (req && req.cookies && req.cookies.token) ? req.cookies.token : cookie.load('token')

    if (req && !token) {
        res.writeHead(302, { Location: '/' }).end()
    } else if (!token) {
        document.location.pathname = '/'
    }
}
*/