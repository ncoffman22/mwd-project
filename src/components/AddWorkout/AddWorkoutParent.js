import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddWorkoutChild from "./AddWorkoutChild";
import SplitSelectorChild from "./SplitSelectorChild";
import AddSplitChild from "./AddSplitChild";
import splitService from "../../services/splitService";
import { useEffect } from "react";

export default function AddWorkoutParent({ onAddWorkout, user }) {
  const [workout, setWorkout] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    date: new Date().toISOString().split("T")[0], // Default to today
  });
  const [split, setSplit] = useState([]);
  const [selectedSplit, setSelectedSplit] = useState("");
  const [showAddSplitForm, setShowAddSplitForm] = useState(false);

  useEffect(() => {
    const loadSplits = async () => {
      const fetchedSplits = await splitService.loadSplits(user);
      setSplit(fetchedSplits);
    };
    loadSplits();
  }, [user]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    // update a workout with new changes
    const { name, value } = e.target;
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    // Add new workout and call function to save
    e.preventDefault();
    const newWorkout = {
      ...workout,
      id: Date.now(),
      sets: parseInt(workout.sets),
      reps: parseInt(workout.reps),
      weight: parseFloat(workout.weight),
      splitID: selectedSplit,
    };
    // Add the workout
    onAddWorkout(newWorkout);

    // Reset the form
    setWorkout({
      name: "",
      sets: "",
      reps: "",
      weight: "",
      date: new Date().toISOString().split("T")[0],
    });
    navigate("/workouts"); // Send to workout page
  };

  const handleAddNewSplit = async (newSplit) => {
    try {
      const addedSplit = await splitService.addSplit(user, newSplit);
      setSplit((prevSplits) => [...prevSplits, addedSplit]);
      setSelectedSplit(addedSplit.id);
      setShowAddSplitForm(false);
    } catch (error) {
      console.error("Failed to add new split:", error);
      alert("Failed to add new split");
    }
  };
  return (
    <>
      {showAddSplitForm ? (
        <AddSplitChild
          onAddSplit={handleAddNewSplit}
          onCancel={() => setShowAddSplitForm(false)}
        />
      ) : (
        <>
          <SplitSelectorChild
            split={split}
            selectedSplit={selectedSplit}
            onSelectSplit={setSelectedSplit}
            onAddNewSplitClick={() => setShowAddSplitForm(true)}
          />
          <hr />
          <AddWorkoutChild
            workout={workout}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </>)
        }
    </>
  );
}
