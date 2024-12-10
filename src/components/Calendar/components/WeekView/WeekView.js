import React, { useState, useMemo } from 'react';
import { Card, Button, Typography, Badge, Space } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { Text, Title } = Typography;

const WeekView = ({ workouts = [], onWorkoutClick, selectedDate }) => {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        return selectedDate ? dayjs(selectedDate).startOf('week') : dayjs().startOf('week');
    });

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, index) => {
            const date = currentWeekStart.add(index, 'day');
            return {
                date,
                dayName: date.format('dddd'),
                dayNumber: date.format('D'),
                isToday: date.isSame(dayjs(), 'day')
            };
        });
    }, [currentWeekStart]);

    const getWorkoutsForDay = (date) => {
        return workouts.filter(workout => {
            // Convert both dates to start of day for comparison
            const workoutDate = dayjs(workout.date).startOf('day');
            return workoutDate.isSame(date.startOf('day'), 'day');
        });
    };

    const navigateWeek = (direction) => {
        setCurrentWeekStart(prev => 
            direction === 'next' 
                ? prev.add(1, 'week')
                : prev.subtract(1, 'week')
        );
    };

    const goToCurrentWeek = () => {
        setCurrentWeekStart(dayjs().startOf('week'));
    };

    return (
        <div className="flex flex-col h-full min-h-[600px]">
            <div className="flex justify-between items-center mb-4 text-center py-2 bg-gray-50 rounded-lg">
                <Title level={5} className="m-0 mb-3">
                    Week of {currentWeekStart.format('MMMM D, YYYY')}
                </Title>
                <Space>
                    <Button 
                        icon={<ChevronLeft className="h-4 w-4" />}
                        onClick={() => navigateWeek('prev')}
                    />
                    <Button onClick={goToCurrentWeek}>
                        Today
                    </Button>
                    <Button 
                        icon={<ChevronRight className="h-4 w-4" />}
                        onClick={() => navigateWeek('next')}
                    />
                </Space>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 flex-grow">
                {weekDays.map(({ date, dayName, dayNumber, isToday }) => {
                    const dayWorkouts = getWorkoutsForDay(date);

                    return (
                        <Card 
                            key={date.format('YYYY-MM-DD')}
                            className={`h-full ${isToday ? 'border-blue-500 border-2' : ''}`}
                        >
                            <div className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <Text strong className="block">{dayName}</Text>
                                    <Text type="secondary">{dayNumber}</Text>
                                </div>
                                {isToday && (
                                    <Badge status="processing" text="Today" />
                                )}
                            </div>

                            <div className="mt-2">
                                {dayWorkouts.length > 0 ? (
                                    <div className="space-y-2">
                                        {dayWorkouts.map((workout) => (
                                            <div 
                                                key={workout.id}
                                                className="p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => onWorkoutClick?.(workout)}
                                            >
                                                <div>
                                                    <Text strong className="block">
                                                        {workout.splitName}: Day {workout.day}
                                                    </Text>
                                                    <div className="mt-1">
                                                        {workout.lifts?.map((lift, index) => (
                                                            <Text key={lift.id || index} className="block text-xs text-gray-600">
                                                                {lift.name}: {lift.sets}×{lift.reps} @ {lift.weight}lbs
                                                            </Text>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-4">
                                        <Text type="secondary" className="text-sm">
                                            No workouts scheduled
                                        </Text>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default WeekView;