import React from 'react'
import autobind from 'autobind-decorator'
import { nextConnect } from 'next/connect'
import { registerUser, loginUser } from 'actions/authenticate'
import { Form, Input, Tooltip, Icon, Checkbox, Button, notification } from 'antd'

const FormItem = Form.Item

@nextConnect((state) => state)
class LoginForm extends React.Component {
    state = {
        confirmDirty: '',
    }

    @autobind
    handleConfirmBlur(e) {
        const value = e.target.value
        this.setState({ confirmDirty: this.state.confirmDirty || !!value })
    }

    @autobind
    checkPassword(rule, value, callback) {
        const form = this.props.form
        if (value && value !== form.getFieldValue('password')) {
            callback('비밀번호가 일치하지 않습니다.')
        } else {
            callback()
        }
    }

    @autobind
    checkConfirm(rule, value, callback) {
        const form = this.props.form
        if (value && this.state.confirmDirty) {
            form.validateFields(['repassword'], { force: true })
        }
        callback()
    }

    @autobind
    handleSubmit(e) {
        e.preventDefault();
        const { dispatch, form: { validateFields, setFields } } = this.props

        validateFields(async (err, values) => {
            if (err) return

            await dispatch(registerUser(values))
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
                await dispatch(loginUser(values))
                document.location.href = '/'
            }
        });
    }

    @autobind
    alert() {
        notification['error']({
            message: '페이지 준비 중입니다.',
            description: '서비스 이용약관은 준비 중입니다.',
        })
    }

    render() {
        const { authenticate, form: { getFieldDecorator } } = this.props
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        }
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        }

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="이메일"
                    hasFeedback
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '올바른 이메일 주소가 아닙니다.',
                        }, {
                            required: true, message: '이메일을 입력해주세요.',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="비밀번호"
                    hasFeedback
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '비밀번호를 입력해주세요.',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="비밀번호 확인"
                    hasFeedback
                >
                    {getFieldDecorator('repassword', {
                        rules: [{
                            required: true, message: '비밀번호를 확인해주세요.',
                        }, {
                            validator: this.checkPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            닉네임&nbsp;<Tooltip title="What do you want other to call you?"><Icon type="question-circle-o" /></Tooltip>
                        </span>
                    )}
                    hasFeedback
                >
                    {getFieldDecorator('nick', {
                        rules: [{ required: true, message: '닉네임을 입력해주세요.', whitespace: true }],
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                    {getFieldDecorator('agreement', {
                        rules: [{ required: true, message: '서비스 이용약관에 동의하셔야 합니다.' }],
                        valuePropName: 'checked',
                    })(
                        <Checkbox><a onClick={ this.alert }>서비스 이용약관</a>에 동의합니다.</Checkbox>
                    )}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">회원가입</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(LoginForm)