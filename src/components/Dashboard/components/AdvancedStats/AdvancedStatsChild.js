import React, { useState } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, 
    PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

const AdvancedStatsChild = ({ statistics = [] }) => {
    const [selectedLiftType, setSelectedLiftType] = useState('all');
    const [timeRange, setTimeRange] = useState('month');

    const getFilteredStats = () => {
        if (!Array.isArray(statistics)) return [];
        
        if (selectedLiftType === 'all') {
            return statistics;
        }
        return statistics.filter(stat => stat?.liftType?.objectId === selectedLiftType);
    };

    // Calculate strength progress rate
    const getProgressRate = () => {
        // Get filtered stats and sort by overall progress rate
        const sortedStats = getFilteredStats()
            .map(stat => ({
                stat,
                totalProgress: Math.abs(stat?.progressVelocity?.overall || 0)
            }))
            .sort((a, b) => b.totalProgress - a.totalProgress)
            .slice(0, 6) // Only take top 6 exercises
            .map(({ stat }) => ({
                exercise: stat?.liftType?.name || 'Unknown',
                weekly: stat?.progressVelocity?.weekly || 0,
                monthly: stat?.progressVelocity?.monthly || 0,
                overall: stat?.progressVelocity?.overall || 0
            }));
        return sortedStats;
    };
    // Format strength metrics for the radar chart
    const getStrengthProfile = () => {
        // Get filtered stats and sort by total volume to find most significant exercises
        const sortedStats = getFilteredStats()
            .map(stat => ({
                stat,
                totalVolume: (stat?.volumeIntensity?.average || 0) * (stat?.workoutFrequency?.weeklyAverage || 0)
            }))
            .sort((a, b) => b.totalVolume - a.totalVolume)
            .slice(0, 6) // Only take top 6 exercises
            .map(({ stat }) => ({
                exercise: stat?.liftType?.name || 'Unknown',
                maxStrength: (stat?.strengthMetrics?.maxStrength || 0) / 100,
                endurance: (stat?.strengthMetrics?.strengthEndurance || 0) / 100,
                relative: stat?.strengthMetrics?.relativeStrength || 0
            }));
        return sortedStats;
    };
    // Get workout frequency distribution
    const getWorkoutFrequency = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const distribution = {};
        
        days.forEach(day => {
            distribution[day] = getFilteredStats().reduce((sum, stat) => 
                sum + (stat?.workoutFrequency?.dailyDistribution?.[day] || 0), 0
            );
        });

        return days.map(day => ({
            day,
            workouts: distribution[day]
        }));
    };

    // Format volume intensity data
    const getVolumeIntensity = () => {
        const filteredStats = getFilteredStats();
        const volstats = filteredStats.flatMap(stat => 
            (stat?.volumeIntensity?.progression || []).map(prog => ({
                date: new Date(prog.date).toLocaleDateString(),
                intensity: prog.intensity || 0,
                exercise: stat?.liftType?.name || 'Unknown'
            }))
        );
        return volstats.sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    // Helper function to safely get values
    const getSafeValue = (stat, path) => {
        try {
            return path.split('.').reduce((obj, key) => obj?.[key], stat) || 0;
        } catch {
            return 0;
        }
    };
    return (
        <div className="p-4">
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Advanced Training Analytics</h4>
                    <div className="d-flex gap-2">
                        <Form.Select 
                            value={selectedLiftType}
                            onChange={(e) => setSelectedLiftType(e.target.value)}
                            className="w-auto"
                        >
                            <option value="all">All Exercises</option>
                            {statistics.map(stat => (
                                <option 
                                    key={stat?.liftType?.objectId} 
                                    value={stat?.liftType?.objectId}
                                >
                                    {stat?.liftType?.name || 'Unknown'}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-auto"
                        >
                            <option value="week">Past Week</option>
                            <option value="month">Past Month</option>
                            <option value="year">Past Year</option>
                        </Form.Select>
                    </div>
                </Card.Header>
                
                <Card.Body>
                    <Row>
                        <Col lg={6} className="mb-4">
                            <Card>
                                <Card.Header>Progress Rate (lbs/day)</Card.Header>
                                <Card.Body>
                                    <div style={{ height: 300 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={getProgressRate()} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="exercise" type="category" />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="weekly" name="Weekly" fill="#8884d8" />
                                                <Bar dataKey="monthly" name="Monthly" fill="#82ca9d" />
                                                <Bar dataKey="overall" name="Overall" fill="#ffc658" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col lg={6} className="mb-4">
                            <Card>
                                <Card.Header>Strength Analysis</Card.Header>
                                <Card.Body>
                                    <div style={{ height: 300 }}>
                                        <ResponsiveContainer>
                                            <RadarChart data={getStrengthProfile()}>
                                                <PolarGrid stroke="#e5e5e5" />
                                                <PolarAngleAxis 
                                                    dataKey="exercise"
                                                    tick={{ fill: '#666', fontSize: 12 }}
                                                    axisLine={{ stroke: '#e5e5e5' }}
                                                />
                                                <PolarRadiusAxis stroke="#e5e5e5" />
                                                <Radar 
                                                    name="Max Strength" 
                                                    dataKey="maxStrength" 
                                                    stroke="#2563eb" 
                                                    fill="#2563eb" 
                                                    fillOpacity={0.3}
                                                />
                                                <Radar 
                                                    name="Endurance" 
                                                    dataKey="endurance" 
                                                    stroke="#16a34a" 
                                                    fill="#16a34a" 
                                                    fillOpacity={0.3}
                                                />
                                                <Radar 
                                                    name="Relative Strength" 
                                                    dataKey="relative" 
                                                    stroke="#ca8a04" 
                                                    fill="#ca8a04" 
                                                    fillOpacity={0.3}
                                                />
                                                <Legend 
                                                    wrapperStyle={{ paddingTop: '20px' }}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={6} className="mb-4">
                            <Card>
                                <Card.Header>Weekly Training Pattern</Card.Header>
                                <Card.Body>
                                    <div style={{ height: 300 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={getWorkoutFrequency()}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="day" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar 
                                                    dataKey="workouts" 
                                                    fill="#8884d8" 
                                                    name="Workouts" 
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col lg={6} className="mb-4">
                            <Card>
                                <Card.Header>Volume Intensity Trends</Card.Header>
                                <Card.Body>
                                    <div style={{ height: 300 }}>
                                        <ResponsiveContainer>
                                            <LineChart data={getVolumeIntensity()}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="intensity" 
                                                    stroke="#8884d8" 
                                                    name="Intensity" 
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>Recovery Insights</Card.Header>
                                <Card.Body>
                                    <Row>
                                        {getFilteredStats().map(stat => (
                                            <Col key={stat?.liftType?.objectId} md={4} className="mb-3">
                                                <h6>{stat?.liftType?.name || 'Unknown'}</h6>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Average Rest:</span>
                                                    <strong>{(getSafeValue(stat, 'restPeriods.average') || 0).toFixed(1)} days</strong>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Optimal Day:</span>
                                                    <strong>{getSafeValue(stat, 'performancePatterns.bestDayOfWeek') || 'N/A'}</strong>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span>Weekly Frequency:</span>
                                                    <strong>{(getSafeValue(stat, 'workoutFrequency.weeklyAverage') || 0).toFixed(1)}</strong>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdvancedStatsChild;