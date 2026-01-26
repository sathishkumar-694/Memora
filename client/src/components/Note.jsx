import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

const Note = ({ note, onDelete, onEdit, onToggle }) => {
  return (
    <Card className="h-100 shadow-sm border">
      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0 text-truncate" style={{ maxWidth: "70%", fontSize: "1.1rem" }}>
            {note.title}
          </Card.Title>
          <Badge bg={note.status === "completed" ? "success" : "warning"} text="dark" style={{fontSize: "0.7rem"}}>
            {note.status}
          </Badge>
        </div>
        
        <Card.Text 
          className="flex-grow-1 text-muted mb-3" 
          style={{ 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            fontSize: "0.9rem"
          }}
        >
          {note.content}
        </Card.Text>

        <div className="d-flex gap-2 pt-2 border-top">
           <Button 
            variant="outline-primary" 
            size="sm" 
            className="flex-grow-1"
            onClick={() => onEdit(note)}
          >
            View
          </Button>

          <Button 
            variant={note.status === "active" ? "outline-success" : "outline-secondary"} 
            size="sm"
            onClick={() => onToggle(note._id, note.status)}
            title={note.status === "active" ? "Mark as Completed" : "Mark as Active"}
          >
            {note.status === "active" ? "✓" : "↺"}
          </Button>

          <Button 
            variant="danger" 
            size="sm"
            onClick={() => onDelete(note._id)}
          >
            🗑
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Note;