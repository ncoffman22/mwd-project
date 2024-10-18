import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function AddSplitChild({ onAddSplit, onCancel }) {
    const [splitTitle, setSplitTitle] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (splitTitle.trim()) {
            onAddSplit( { split_title: splitTitle.trim() } );
            setSplitTitle("");
        }
    };

    return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="splitTitle">
        <Form.Label>Split Title</Form.Label>
        <Form.Control
          type="text"
          value={splitTitle}
          onChange={(e) => setSplitTitle(e.target.value)}
          placeholder="Enter split title"
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Add Split
      </Button>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </Form>
  );
}