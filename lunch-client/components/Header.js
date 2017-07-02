import autobind from 'autobind-decorator';
import React from 'react'
import Link from 'next/link'
import { Input, Button, Icon } from 'antd'
import { nextConnect } from 'next/connect'
import { logoutUser } from 'actions/authenticate';

const Search = Input.Search

@nextConnect((state) => state)
class Header extends React.Component {
    @autobind
    async logout() {
        await this.props.dispatch(logoutUser())
    }

    render() {
        let { pathname, authenticate: { content, authenticated } } = this.props

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
                                <Link href="/woori-food/list" as="/woori-food">
                                    <a className={ pathname === '/woori-food/list' && 'active' }>
                                        우리푸드
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/babdo/list" as="/babdo">
                                    <a className={ pathname === '/babdo/list' && 'active' }>
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

                            <Search
                                placeholder="검색"
                                style={{ width: 200 }}
                                onSearch={value => alert('준비중')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header

