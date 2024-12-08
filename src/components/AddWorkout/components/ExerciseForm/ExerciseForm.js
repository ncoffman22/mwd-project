import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ExerciseForm = ({ liftType, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		sets: '',
		reps: '',
		weight: '',
	});

	const isBodyweightExercise = liftType.get('equipment')?.toLowerCase() === 'body only';
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = () => {
		if (formData.sets && formData.reps && (isBodyweightExercise || formData.weight)) {
			onSubmit({
				liftType,
				...formData,
				weight: isBodyweightExercise ? 0 : formData.weight
			});
		}
	};

	return (
		<div className="p-3 border rounded bg-light">
			<h6>{liftType.get('name')}</h6>
			<Row>
				<Col md={isBodyweightExercise ? 6 : 4}>
					<Form.Group className="mb-2">
						<Form.Label>Sets</Form.Label>
						<Form.Control
							type="number"
							name="sets"
							value={formData.sets}
							onChange={handleChange}
							required
							min="1"
						/>
					</Form.Group>
				</Col>
				<Col md={isBodyweightExercise ? 6 : 4}>
					<Form.Group className="mb-2">
						<Form.Label>Reps</Form.Label>
						<Form.Control
							type="number"
							name="reps"
							value={formData.reps}
							onChange={handleChange}
							required
							min="1"
						/>
					</Form.Group>
				</Col>
				{!isBodyweightExercise && (
					<Col md={4}>
						<Form.Group className="mb-2">
							<Form.Label>Weight (lbs)</Form.Label>
							<Form.Control
								type="number"
								name="weight"
								value={formData.weight}
								onChange={handleChange}
								required
								min="0"
								step="0.5"
							/>
						</Form.Group>
					</Col>
				)}
			</Row>
			<div className="d-flex justify-content-end gap-2 mt-2">
				<Button variant="secondary" onClick={onCancel}>
					Cancel
				</Button>
				<Button 
					variant="primary" 
					onClick={handleSubmit}
					disabled={!formData.sets || !formData.reps || (!isBodyweightExercise && !formData.weight)}
				>
					Add to Workout
				</Button>
			</div>
		</div>
	);
};

export default ExerciseForm;