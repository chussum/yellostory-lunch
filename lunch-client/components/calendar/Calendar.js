import React  from 'react'
import PropTypes from 'prop-types'
import createDateObjects from './createDateObjects'
import moment from 'moment'
import 'moment/locale/ko'
import { Button } from 'antd'

export default class Calendar extends React.Component {
    static propTypes = {
        /** Week offset*/
        weekOffset: PropTypes.number.isRequired,
        /** The current date as a moment objecct */
        date: PropTypes.object.isRequired,
        /** Function to render a day cell */
        renderDay: PropTypes.func,
        /** Called on next month click */
        onNextMonth: PropTypes.func,
        /** Called on prev month click */
        onPrevMonth: PropTypes.func,
        /** Called when some of the navigation controls are clicked */
        onChangeMonth: PropTypes.func,
        /** Called when a date is clicked */
        onPickDate: PropTypes.func
    }

    static defaultProps = {
        weekOffset: 0,
        renderDay: day => day.format('YYYY-MM-D')
    }

    handleNextMonth = () => {
        if (this.props.onNextMonth) {
            return this.props.onNextMonth()
        }

        this.props.onChangeMonth(this.props.date.clone().add(1, 'months'))
    }

    handlePrevMonth = () => {
        if (this.props.onPrevMonth) {
            return this.props.onPrevMonth()
        }

        this.props.onChangeMonth(this.props.date.clone().subtract(1, 'months'))
    }

    handleTodayMonth = () => {
        this.props.onChangeMonth(moment());
    };

    render() {
        const {
            date,
            weekOffset,
            renderDay,
            onNextMonth,
            onPrevMonth,
            onPickDate,
            onChange
        } = this.props

        return (
            <div className="calendar">
                <div className="calendar-header">
                    <Button className="calendar-header-left" onClick={this.handlePrevMonth}>«</Button>
                    <div className="calendar-header-currentDate">
                        { this.props.title && this.props.title + ' ' } {date.format('MMMM 식단표 (YYYY년도)') }
                    </div>
                    <Button className="calendar-header-today" onClick={ this.handleTodayMonth }>오늘</Button>
                    <Button className="calendar-header-right" onClick={ this.handleNextMonth }>»</Button>
                </div>
                <div className="calendar-grid">
                    <div className="calendar-grid-item title">일</div>
                    <div className="calendar-grid-item title">월</div>
                    <div className="calendar-grid-item title">화</div>
                    <div className="calendar-grid-item title">수</div>
                    <div className="calendar-grid-item title">목</div>
                    <div className="calendar-grid-item title">금</div>
                    <div className="calendar-grid-item title">토</div>

                    {createDateObjects(date, weekOffset).map((day, i) => (
                        <div
                            key={`day-${i}`}
                            className={`calendar-grid-item ${day.classNames || ''}`}
                            onClick={e => onPickDate(day.day)}
                        >
                            {renderDay(day.day)}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}