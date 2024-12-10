import React, { useState } from 'react';
import { Calendar, Radio, Typography, Select, Space, Button } from 'antd';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import WeekView from './components/WeekView/WeekView';
import DateCellRender from './components/DateCell/DateCellRender';

const { Text } = Typography;

const CalendarChild = ({ workouts = [] }) => {
    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const navigate = useNavigate();

    const handleWorkoutClick = (workout) => {
        navigate(`/workout/${workout.id}`, { state: { workout } });
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleViewChange = (e) => {
        const newView = e.target.value;
        setView(newView);
    };

    // Custom header renderer for the Calendar
    const customHeader = ({ value, onChange }) => {
        const month = value.month();
        const year = value.year();

        const months = Array.from({ length: 12 }, (_, i) => ({
            value: i,
            label: dayjs().month(i).format('MMMM')
        }));

        const years = Array.from({ length: 21 }, (_, i) => ({
            value: year - 10 + i,
            label: `${year - 10 + i}`
        }));

        const handlePrevMonth = () => {
            onChange(value.subtract(1, 'month'));
            setSelectedDate(value.subtract(1, 'month'));
        };

        const handleNextMonth = () => {
            onChange(value.add(1, 'month'));
            setSelectedDate(value.add(1, 'month'));
        };

        const handleMonthChange = (newMonth) => {
            const newDate = value.month(newMonth);
            onChange(newDate);
            setSelectedDate(newDate);
        };

        const handleYearChange = (newYear) => {
            const newDate = value.year(newYear);
            onChange(newDate);
            setSelectedDate(newDate);
        };

        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '16px',
                padding: '8px'
            }}>
                <Button 
                    onClick={handlePrevMonth}
                    style={{ margin: 0 }}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px'
                }}>
                    <Select
                        value={month}
                        onChange={handleMonthChange}
                        options={months}
                        style={{ width: 120 }}
                    />
                    <Select
                        value={year}
                        onChange={handleYearChange}
                        options={years}
                        style={{ width: 100 }}
                    />
                </div>
                <Button 
                    onClick={handleNextMonth}
                    style={{ margin: 0 }}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    return (
        <div>
            <div className="mb-4 p-4 bg-white border-b">
                <div>
                    <div className="flex gap-2 mb-3 text-center">
                        <CalendarIcon className="h-6 w-6 text-blue-500" />
                        <br />
                        <h3 strong>Workout Calendar</h3>
                    </div>
                    <Radio.Group 
                        value={view} 
                        onChange={handleViewChange}
                    >
                        <Radio.Button value="month">Month</Radio.Button>
                        <Radio.Button value="week">Week</Radio.Button>
                    </Radio.Group>
                </div>
            </div>

            <div className="flex-grow overflow-auto p-4">
                {view === 'month' ? (
                    <Calendar
                        className="h-full"
                        cellRender={(value, info) => {
                            if (info.type === 'date') return (
                                <DateCellRender 
                                    value={value} 
                                    workouts={workouts} 
                                    handleWorkoutClick={handleWorkoutClick}
                                />
                            );
                            return info.originNode;
                        }}
                        fullscreen={true}
                        onSelect={handleDateSelect}
                        value={selectedDate}
                        headerRender={customHeader}
                    />
                ) : (
                    <WeekView
                        workouts={workouts}
                        onWorkoutClick={handleWorkoutClick}
                        selectedDate={selectedDate}
                    />
                )}
            </div>
        </div>
    );
};

export default CalendarChild;