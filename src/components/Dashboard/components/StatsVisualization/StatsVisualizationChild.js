import React, { useState } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);
const StatsVisualizationChild = ({ statistics }) => {
    const [selectedLiftType, setSelectedLiftType] = useState('all');

    // Adjust day to local timezone
    const adjustedDay = ({ date }) => {
        return dayjs(date)
            .subtract(dayjs().utcOffset(), 'minutes')
            .format('YYYY-MM-DD');
    };

    // Filter statistics based on selected lift type
    const getFilteredStats = () => {
        if (selectedLiftType === 'all') {

            return statistics;
        }

        return statistics.filter(stat => stat.liftType.objectId === selectedLiftType);
    };

    // Get 1RM data
    const getOneRMData = () => {
        const filteredStats = getFilteredStats();
        const oneRMData = filteredStats.flatMap(stat =>
            stat.oneRMProgression.map(prog => ({
                date: adjustedDay({ date: prog.date }),
                weight: prog.value,
                liftType: stat.liftType
            }))
        );
        
        oneRMData.sort((a, b) => a.date.localeCompare(b.date));
        return oneRMData;
    };

    // Get volume data
    const getVolumeData = () => {
        const filteredStats = getFilteredStats();
        const volumeData = filteredStats.flatMap(stat => 
            stat.volumeProgression.map(prog => ({
                date: adjustedDay({ date: prog.date }),
                volume: prog.value,
                exercise: stat.liftType.name
            }))
        );
        // sort by date
        volumeData.sort((a, b) => new Date(a.date) - new Date(b.date));
        return volumeData;
    };

    // Improved exercise distribution calculation
    const getExerciseDistribution = () => {
        const distribution = {};
        statistics.forEach(stat => {
            const exercise = stat.liftType.name;
            distribution[exercise] = (distribution[exercise] || 0) + stat.totalVolume;
        });

        let sortedExercises = Object.entries(distribution)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // Take top 5 exercises and group the rest into "Others"
        const topExercises = sortedExercises.slice(0, 5);
        const otherExercises = sortedExercises.slice(5);

        if (otherExercises.length > 0) {
            const othersSum = otherExercises.reduce((sum, exercise) => sum + exercise.value, 0);
            topExercises.push({
                name: 'Others',
                value: othersSum
            });
        }

        return topExercises;
    };

    const COLORS = ['#2196F3', '#4CAF50', '#FFC107', '#FF5722', '#9C27B0', '#90CAF9'];

    return (
        <div className="p-3">
            <Card className="mb-4">
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>Workout Statistics</h3>
                        <Form.Select 
                            value={selectedLiftType}
                            onChange={(e) => setSelectedLiftType(e.target.value)}
                            style={{ width: 'auto' }}
                        >
                            <option value="all">All Exercises</option>
                            {statistics.map(stat => (
                                <option 
                                    key={stat.liftType.objectId} 
                                    value={stat.liftType.objectId}
                                >
                                    {stat.liftType.name}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </Card.Header>
                
                <Card.Body>
                    {selectedLiftType === 'all' ? (
                        <Row>
                            <div>
                                <Col md={6} className="mb-4">
                                    <Card>
                                        <Card.Header>Volume Progression</Card.Header>
                                        <Card.Body>
                                            <div style={{ height: 300 }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={getVolumeData()}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="date" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar 
                                                            dataKey="volume" 
                                                            fill="#4CAF50" 
                                                            name="Volume (lbs)"
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className="mb-4">
                                    <Card>
                                        <Card.Header>Exercise Distribution</Card.Header>
                                        <Card.Body>
                                            <div style={{ height: '30vh' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={getExerciseDistribution()}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={100}
                                                            fill="#8884d8"
                                                            label
                                                            activeIndex={-1}
                                                            activeShape={null}
                                                            isAnimationActive={false}
                                                        >
                                                            {getExerciseDistribution().map((entry, index) => (
                                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={ ({ active, payload }) => {
                                                            if (!active || !payload || !payload.length) return null;
                                                            const { name, value } = payload[0].payload;
                                                            return (
                                                                <div style={{                     
                                                                    backgroundColor: '#fff',
                                                                    padding: '8px',
                                                                    border: '1px solid #ccc',
                                                                    borderRadius: '4px'}}>
                                                                    <p className="mb-1">{name}</p>
                                                                    <p className="mb-0">{`Volume: ${value.toLocaleString()} lbs`}</p>
                                                                </div>
                                                            );
                                                        }
                                                        }/>
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </div>
                        </Row>
                        ) : (
                        <Row>
                            <Col md={6} className="mb-4">
                            <Card>
                                <Card.Header>1RM Progress Over Time</Card.Header>
                                <Card.Body>
                                    <div style={{ height: 300 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={getOneRMData()}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="weight" 
                                                    stroke="#2196F3" 
                                                    name="1RM (lbs)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="mb-4">
                            <Card>
                                <Card.Header>Key Statistics</Card.Header>
                                <Card.Body>
                                    {getFilteredStats().map(stat => (
                                        <div 
                                            key={stat.liftType.objectId}
                                            className="mb-3"
                                        >
                                            <h6>{stat.liftType.name}</h6>
                                            <div className="d-flex justify-content-between">
                                                <span>Current 1RM:</span>
                                                <strong>{Math.round(stat.calculatedOneRepMax)} lbs</strong>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Best Weight:</span>
                                                <strong>{stat.bestWeight} lbs</strong>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Best Reps:</span>
                                                <strong>{stat.bestReps}</strong>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Weekly Volume:</span>
                                                <strong>{Math.round(stat.weeklyVolume).toLocaleString()} lbs</strong>
                                            </div>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                        )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default StatsVisualizationChild;