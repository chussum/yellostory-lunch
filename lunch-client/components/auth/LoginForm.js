import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import autobind from 'autobind-decorator'
import { Form, Icon, Input, Button, Checkbox, notification } from 'antd'
import { nextConnect } from 'next/connect'
import { loginUser } from 'actions/authenticate';

const FormItem = Form.Item

@nextConnect((state) => state)
class LoginForm extends React.Component {
    @autobind
    handleSubmit(e) {
        e.preventDefault();
        const { dispatch, form: { validateFields, setFields } } = this.props

        validateFields(async (err, values) => {
            if (err) return

            await dispatch(loginUser(values))
            let { authenticate } = this.props
            if (authenticate.error) {
                let fieldError = {}
                fieldError[authenticate.error.code] = {
                    value: values[authenticate.error.code],
                    errors: [
                        new Error(authenticate.error.message)
                    ]
                }

                setFields(fieldError)
            } else {
                Router.push('/')
            }
        });
    }

    @autobind
    alert() {
        notification['error']({
            message: '페이지 준비 중입니다.',
            description: '비밀번호 찾기 기능은 준비 중입니다.',
        })
    }

    render() {
        const { authenticate, form: { getFieldDecorator } } = this.props

        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: '이메일을 입력하세요.' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="이메일" disabled={authenticate.fetching} />
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '비밀번호를 입력하세요.' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="비밀번호" disabled={authenticate.fetching} />
                    )}
                </FormItem>

                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={authenticate.fetching}>
                        로그인
                    </Button>

                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: false,
                    })(
                        <Checkbox>자동로그인</Checkbox>
                    )}

                    <div className="login-form-forgot">
                        <span>
                            <Link href="/register"><a>회원가입</a></Link>
                        </span>
                        <span>
                            <a onClick={this.alert}>비밀번호 찾기</a>
                        </span>
                    </div>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(LoginForm)