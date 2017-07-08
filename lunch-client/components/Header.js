import autobind from 'autobind-decorator';
import React from 'react'
import Link from 'next/link'
import { Input, Button, Icon } from 'antd'
import { nextConnect } from 'next/connect'
import { logoutUser } from 'actions/authenticate';

@nextConnect((state) => state)
class Header extends React.Component {
    @autobind
    async logout() {
        await this.props.dispatch(logoutUser())
        let pathname = document && document.location && document.location.pathname.replace(/\/$/g,'')
        if (pathname !== '' && pathname !== '/') {
            document.location.href = '/'
        }
    }

    render() {
        let { pathname, query, authenticate: { content } } = this.props
        return (
            <div className="header">
                <div className="gnb">
                    <div>
                        <h1>
                            <Link href="/">
                                <a><img className="logo" src="/static/images/logo.png" alt="" /></a>
                            </Link>
                        </h1>

                        <ul className="nav">
                            <li>
                                <Link href="/foods/list?category=우리푸드" as="/woori-food">
                                    <a className={ pathname === '/foods/list' && query.category === '우리푸드' && 'active' }>
                                        우리푸드
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/foods/list?category=밥도" as="/babdo">
                                    <a className={ pathname === '/foods/list' && query.category === '밥도' && 'active' }>
                                        밥도
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/">
                                    <a className={ pathname === '/' && 'active' }>
                                        오늘의 점심
                                    </a>
                                </Link>
                            </li>
                        </ul>

                        <div className="right">
                            <span className="welcome">
                                <Icon type="wifi" /> 환영합니다. <strong>{ content.nick }</strong>님
                            </span>

                            <Button className="logout" onClick={ this.logout }>
                                로그아웃
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header

