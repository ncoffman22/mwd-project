import React, { useState } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatsVisualizationChild = ({ statistics }) => {
    const [selectedLiftType, setSelectedLiftType] = useState('all');

    const getFilteredStats = () => {
        if (selectedLiftType === 'all') {

            return statistics;
        }

        return statistics.filter(stat => stat.liftType.objectId === selectedLiftType);
    };

    const getOneRMData = () => {
        const filteredStats = getFilteredStats();
        const oneRMData =  filteredStats.flatMap(stat =>
            stat.oneRMProgression.map(prog => ({
                date: new Date(prog.date).toLocaleDateString(),
                weight: prog.value,
                liftType: stat.liftType
            }))
        );
        // sort by date
        oneRMData.sort((a, b) => new Date(a.date) - new Date(b.date));
        return oneRMData;
    };

    const getVolumeData = () => {
        const filteredStats = getFilteredStats();
        const volumeData = filteredStats.flatMap(stat => 
            stat.volumeProgression.map(prog => ({
                date: new Date(prog.date).toLocaleDateString(),
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

    // Custom colors that are visually distinct
    const COLORS = ['#2196F3', '#4CAF50', '#FFC107', '#FF5722', '#9C27B0', '#90CAF9'];

    // Custom tooltip formatter
    const customTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ 
                    backgroundColor: '#fff',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0 }}>{`${payload[0].name}`}</p>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                        {`${Math.round(payload[0].value).toLocaleString()} lbs`}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom legend that wraps better
    const renderLegend = (props) => {
        const { payload } = props;
        
        return (
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                gap: '8px',
                padding: '8px'
            }}>
                {payload.map((entry, index) => (
                    <div 
                        key={`legend-${index}`}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            marginRight: '8px'
                        }}
                    >
                        <div style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: entry.color,
                            marginRight: '4px'
                        }} />
                        <span style={{ fontSize: '12px' }}>{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

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
                    <Row>
                        <Col md={6} className="mb-4">
                            <Card>
                                <Card.Header>1RM Progress Over Time</Card.Header>
                                <Card.Body>
                                    <div style={{ height: 300 }}>
                                        <ResponsiveContainer>
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
                                <Card.Header>Volume Progression</Card.Header>
                                <Card.Body>
                                    <div style={{ height: 300 }}>
                                        <ResponsiveContainer>
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
                    </Row>

                    <Row>
                        <Col md={6} className="mb-4">
                            <Card>
                                <Card.Header>Exercise Distribution</Card.Header>
                                <Card.Body>
                                    <div style={{ height: 300 }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={getExerciseDistribution()}
                                                    cx="50%"
                                                    cy="45%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    // Remove labelLine and label props
                                                >
                                                    {getExerciseDistribution().map((entry, index) => (
                                                        <Cell 
                                                            key={`cell-${index}`} 
                                                            fill={COLORS[index % COLORS.length]} 
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={customTooltip} />
                                                <Legend 
                                                    content={renderLegend}
                                                    verticalAlign="bottom"
                                                    align="center"
                                                />
                                            </PieChart>
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
                </Card.Body>
            </Card>
        </div>
    );
};

export default StatsVisualizationChild;