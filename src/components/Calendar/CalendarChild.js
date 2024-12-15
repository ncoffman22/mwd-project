import React, { useState } from 'react';
import { Calendar, Radio, Select, Button } from 'antd';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import WeekView from './components/WeekView';
import DateCellRender from './components/DateCellRender';
import "./styles/calendarStyle.css";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const CalendarChild = ({ data }) => {
    const [view, setView] = useState('week');
    const [selectedDate, setSelectedDate] = useState(dayjs());

    
    const getWorkoutsForDay = (date) => {
        return data.workouts.filter(workout => {
            // Convert both dates to start of day for comparison
            const workoutDate = dayjs(workout.date).startOf('day');
            return workoutDate.isSame(date.startOf('day'), 'day');
        });
    };

    const getWorkoutLength = (workout) => {
        for (let i = 1; i <= 8; i++) {
            const dayKey = `day${i}`;
            if (!workout[dayKey]) {
                return i-1;
            }
        }
        return 8;
    }

    const handleViewChange = (e) => {
        const newView = e.target.value;
        setView(newView);
    };

    const handleDateChange = (unit, amount) => {
        const newDate = selectedDate.add(amount, unit);
        setSelectedDate(newDate);
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

        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '16px',
                padding: '8px'
            }}>
                <Button 
                    onClick={() => handleDateChange('month', -1)}
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
                        onChange={(value) => onChange('month', value)}
                        options={months}
                        style={{ width: 120 }}
                    />
                    <Select
                        value={year}
                        onChange={(value) => onChange('year', value)}
                        options={years}
                        style={{ width: 100 }}
                    />
                </div>
                <Button 
                    onClick={() => handleDateChange('month', 1)}
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
                        <h3>Workout Calendar</h3>
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
                                    data={data}
                                    getWorkoutLength={getWorkoutLength}
                                    getWorkoutsForDay={getWorkoutsForDay}
                                />
                            );
                            return info.originNode;
                        }}
                        fullscreen={true}
                        onSelect={(date) => setSelectedDate(date)}
                        value={selectedDate}
                        headerRender={customHeader}
                    />
                ) : (
                    <WeekView
                        data={data}
                        selectedDate={selectedDate}
                        getWorkoutsForDay={getWorkoutsForDay}
                        getWorkoutLength={getWorkoutLength}
                    />
                )}
            </div>
        </div>
    );
};

export default CalendarChild;